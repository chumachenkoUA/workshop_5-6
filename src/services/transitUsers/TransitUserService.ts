import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['transportCard', 'fines', 'complaints'];

export type TransitUserWithGpsLog = {
  user: TransitUser;
  lastGpsLog: UserGpsLog | null;
};

type TransitUserPayload = {
  email: string;
  phone: string;
  fullName: string;
};

export class TransitUserService {
  private transitUserRepository = getRepository(TransitUser);
  private userGpsLogRepository = getRepository(UserGpsLog);

  public async findAll(): Promise<TransitUserWithGpsLog[]> {
    const users = await this.transitUserRepository.find({
      relations: RELATIONS,
      order: { id: 'DESC' },
    });

    const logsMap = await this.fetchLatestGpsLogsMap(users.map((user) => user.id));
    return users.map((user) => ({
      user,
      lastGpsLog: logsMap[user.id] ?? null,
    }));
  }

  public async findOneOrFail(id: string): Promise<TransitUserWithGpsLog> {
    const user = await this.transitUserRepository.findOne(id, { relations: RELATIONS });
    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }

    const lastGpsLog = await this.fetchLatestGpsLog(user.id);
    return { user, lastGpsLog };
  }

  public async create(payload: TransitUserPayload): Promise<TransitUserWithGpsLog> {
    const user = this.transitUserRepository.create(payload);
    const saved = await this.transitUserRepository.save(user);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: TransitUserPayload): Promise<TransitUserWithGpsLog> {
    const user = await this.transitUserRepository.findOne(id);
    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }

    user.email = payload.email;
    user.phone = payload.phone;
    user.fullName = payload.fullName;

    await this.transitUserRepository.save(user);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.transitUserRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }
  }

  private async fetchLatestGpsLogsMap(userIds: string[]): Promise<Record<string, UserGpsLog>> {
    if (!userIds.length) {
      return {};
    }

    const logs = await this.userGpsLogRepository
      .createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .distinctOn(['log.user_id'])
      .where('log.user_id IN (:...userIds)', { userIds })
      .orderBy('log.user_id', 'ASC')
      .addOrderBy('log.captured_at', 'DESC')
      .getMany();

    const map: Record<string, UserGpsLog> = {};
    logs.forEach((log) => {
      map[log.user.id] = log;
    });
    return map;
  }

  private async fetchLatestGpsLog(userId: string): Promise<UserGpsLog | null> {
    return this.userGpsLogRepository.findOne({
      where: { user: { id: userId } },
      order: { capturedAt: 'DESC' },
      relations: ['user'],
    });
  }
}
