import { getRepository } from 'typeorm';

import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['routeStops', 'routeStops.route', 'routeStops.route.transportType'];

type StopPayload = {
  name: string;
  latitude: string;
  longitude: string;
};

export class StopService {
  private stopRepository = getRepository(Stop);

  public async findAll(): Promise<Stop[]> {
    return this.stopRepository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Stop> {
    const stop = await this.stopRepository.findOne(id, { relations: RELATIONS });
    if (!stop) {
      throw new CustomError(404, 'General', `Stop with id:${id} not found.`);
    }
    return stop;
  }

  public async create(payload: StopPayload): Promise<Stop> {
    const stop = this.stopRepository.create(payload);
    const saved = await this.stopRepository.save(stop);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: StopPayload): Promise<Stop> {
    const stop = await this.findOneOrFail(id);
    stop.name = payload.name;
    stop.latitude = payload.latitude;
    stop.longitude = payload.longitude;

    await this.stopRepository.save(stop);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.stopRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Stop with id:${id} not found.`);
    }
  }
}
