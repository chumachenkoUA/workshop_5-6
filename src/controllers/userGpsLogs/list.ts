import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';

import { serializeUserGpsLog } from './serializer';
import { userGpsLogRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const userGpsLogRepository = getRepository(UserGpsLog);

  const logs = await userGpsLogRepository.find({
    relations: userGpsLogRelations,
    order: { capturedAt: 'DESC' },
  });

  return res.customSuccess(200, 'User GPS logs fetched.', logs.map(serializeUserGpsLog));
};
