import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';

import { fetchLatestGpsLogsMap } from './helpers';
import { serializeTransitUser } from './serializer';
import { transitUserRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const transitUserRepository = getRepository(TransitUser);

  const users = await transitUserRepository.find({
    relations: transitUserRelations,
    order: { id: 'DESC' },
  });

  const lastLogsMap = await fetchLatestGpsLogsMap(users.map((user) => user.id));

  return res.customSuccess(
    200,
    'Transit users fetched.',
    users.map((user) => serializeTransitUser(user, lastLogsMap[user.id] ?? null)),
  );
};
