import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeUserGpsLog } from './serializer';
import { userGpsLogRelations } from './shared';
import { normalizeLatitude, normalizeLongitude, normalizeUserId } from './validators';

export const create = async (req: Request, res: Response) => {
  const userId = normalizeUserId(req.body.userId);
  const latitude = normalizeLatitude(req.body.latitude);
  const longitude = normalizeLongitude(req.body.longitude);

  const transitUserRepository = getRepository(TransitUser);
  const user = await transitUserRepository.findOne(userId);

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
  }

  const userGpsLogRepository = getRepository(UserGpsLog);
  const log = userGpsLogRepository.create({
    user,
    latitude,
    longitude,
  });

  await userGpsLogRepository.save(log);

  const createdLog = await userGpsLogRepository.findOne(log.id, {
    relations: userGpsLogRelations,
  });

  if (!createdLog) {
    throw new CustomError(500, 'General', 'User GPS log could not be loaded after creation.');
  }

  return res.customSuccess(201, 'User GPS log created.', serializeUserGpsLog(createdLog));
};
