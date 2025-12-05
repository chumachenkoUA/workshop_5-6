import { getRepository } from 'typeorm';

import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['transportCard', 'fines', 'complaints'];

export type TransitUserWithGpsLog = {
  user: User;
  lastGpsLog: UserGpsLog | null;
};

type TransitUserPayload = {
  email: string;
  phone: string;
  fullName: string;
  password?: string;
};

export class TransitUserService {
  private userRepository = getRepository(User);
  private userGpsLogRepository = getRepository(UserGpsLog);

  public async findAll(): Promise<TransitUserWithGpsLog[]> {
    const users = await this.userRepository.find({
      relations: RELATIONS,
      where: { role: 'TRANSIT' },
      order: { id: 'DESC' },
    });

    const logsMap = await this.fetchLatestGpsLogsMap(users.map((user) => user.id));
    return users.map((user) => ({
      user,
      lastGpsLog: logsMap[user.id] ?? null,
    }));
  }

  public async findOneOrFail(id: string | number): Promise<TransitUserWithGpsLog> {
    const numericId = Number(id);
    const user = await this.userRepository.findOne({
      relations: RELATIONS,
      where: { id: numericId, role: 'TRANSIT' as Role },
    });
    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }

    const lastGpsLog = await this.fetchLatestGpsLog(user.id);
    return { user, lastGpsLog };
  }

  public async create(payload: TransitUserPayload): Promise<TransitUserWithGpsLog> {
    const user = this.userRepository.create({
      email: payload.email,
      phone: payload.phone,
      fullName: payload.fullName,
      name: payload.fullName,
      role: 'TRANSIT' as Role,
      registeredAt: new Date(),
      password: payload.password ?? this.generateTemporaryPassword(),
    });
    user.hashPassword();

    const saved = await this.userRepository.save(user);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: TransitUserPayload): Promise<TransitUserWithGpsLog> {
    const user = await this.userRepository.findOne({ where: { id: Number(id), role: 'TRANSIT' as Role } });
    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }

    user.email = payload.email;
    user.phone = payload.phone;
    user.fullName = payload.fullName;

    await this.userRepository.save(user);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.userRepository.delete({ id: Number(id), role: 'TRANSIT' });
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }
  }

  private async fetchLatestGpsLogsMap(userIds: number[]): Promise<Record<number, UserGpsLog>> {
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

    const map: Record<number, UserGpsLog> = {};
    logs.forEach((log) => {
      map[log.user.id] = log;
    });
    return map;
  }

  private async fetchLatestGpsLog(userId: number): Promise<UserGpsLog | null> {
    return this.userGpsLogRepository.findOne({
      where: { user: Number(userId) },
      order: { capturedAt: 'DESC' },
      relations: ['user'],
    });
  }

  private generateTemporaryPassword(): string {
    return Math.random().toString(36).slice(-10);
  }
}
