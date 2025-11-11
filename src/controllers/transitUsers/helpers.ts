import { getRepository } from 'typeorm';

import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';

export const fetchLatestGpsLogsMap = async (userIds: string[]): Promise<Record<string, UserGpsLog>> => {
  if (!userIds.length) {
    return {};
  }

  const userGpsLogRepository = getRepository(UserGpsLog);
  const logs = await userGpsLogRepository
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
};
