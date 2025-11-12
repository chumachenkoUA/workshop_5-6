import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeUserGpsLog } from './serializer';
import { userGpsLogRelations } from './shared';
import { normalizeIdParam, normalizeLatitude, normalizeLongitude, normalizeUserId } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'User GPS log id');
  const userId = normalizeUserId(req.body.userId);
  const latitude = normalizeLatitude(req.body.latitude);
  const longitude = normalizeLongitude(req.body.longitude);

  const userGpsLogRepository = getRepository(UserGpsLog);
  const log = await userGpsLogRepository.findOne(id, {
    relations: userGpsLogRelations,
  });

  if (!log) {
    throw new CustomError(404, 'General', `User GPS log with id:${id} not found.`);
  }

  const transitUserRepository = getRepository(TransitUser);
  const user = await transitUserRepository.findOne(userId);

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
  }

  log.user = user;
  log.latitude = latitude;
  log.longitude = longitude;

  await userGpsLogRepository.save(log);

  return res.customSuccess(200, 'User GPS log updated.', serializeUserGpsLog(log));
};
