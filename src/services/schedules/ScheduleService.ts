import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { Schedule } from 'orm/entities/transit/Schedule';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['route', 'route.transportType'];

type SchedulePayload = {
  routeId: string;
  workdayStart: string;
  workdayEnd: string;
  intervalMinutes: number;
};

export class ScheduleService {
  private scheduleRepository = getRepository(Schedule);
  private routeRepository = getRepository(Route);

  public async findAll(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: RELATIONS,
      order: { id: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne(id, { relations: RELATIONS });
    if (!schedule) {
      throw new CustomError(404, 'General', `Schedule with id:${id} not found.`);
    }
    return schedule;
  }

  public async create(payload: SchedulePayload): Promise<Schedule> {
    const route = await this.routeRepository.findOne(payload.routeId, { relations: ['transportType', 'schedule'] });
    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    if (route.schedule) {
      throw new CustomError(409, 'General', `Route with id:${payload.routeId} already has a schedule.`);
    }

    const schedule = this.scheduleRepository.create({
      route,
      workdayStart: payload.workdayStart,
      workdayEnd: payload.workdayEnd,
      intervalMinutes: payload.intervalMinutes,
    });

    const saved = await this.scheduleRepository.save(schedule);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: SchedulePayload): Promise<Schedule> {
    const schedule = await this.findOneOrFail(id);
    const route = await this.routeRepository.findOne(payload.routeId, { relations: ['transportType'] });

    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    schedule.route = route;
    schedule.workdayStart = payload.workdayStart;
    schedule.workdayEnd = payload.workdayEnd;
    schedule.intervalMinutes = payload.intervalMinutes;

    await this.scheduleRepository.save(schedule);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.scheduleRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Schedule with id:${id} not found.`);
    }
  }
}
