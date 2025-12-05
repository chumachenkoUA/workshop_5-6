import { getRepository } from 'typeorm';

import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['user'];

type UserGpsLogPayload = {
  userId: string;
  latitude: string;
  longitude: string;
};

export class UserGpsLogService {
  private logRepository = getRepository(UserGpsLog);
  private userRepository = getRepository(User);

  public async findAll(): Promise<UserGpsLog[]> {
    return this.logRepository.find({
      relations: RELATIONS,
      order: { capturedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<UserGpsLog> {
    const log = await this.logRepository.findOne(id, { relations: RELATIONS });
    if (!log) {
      throw new CustomError(404, 'General', `User GPS log with id:${id} not found.`);
    }
    return log;
  }

  public async create(payload: UserGpsLogPayload): Promise<UserGpsLog> {
    const log = this.logRepository.create({
      user: await this.loadUser(payload.userId),
      latitude: payload.latitude,
      longitude: payload.longitude,
    });

    const saved = await this.logRepository.save(log);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: UserGpsLogPayload): Promise<UserGpsLog> {
    const log = await this.findOneOrFail(id);
    log.user = await this.loadUser(payload.userId);
    log.latitude = payload.latitude;
    log.longitude = payload.longitude;

    await this.logRepository.save(log);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.logRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `User GPS log with id:${id} not found.`);
    }
  }

  private async loadUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: Number(userId), role: 'TRANSIT' } });
    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
    }
    return user;
  }
}
