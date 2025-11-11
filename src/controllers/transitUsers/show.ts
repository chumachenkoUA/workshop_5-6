import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransitUser } from './serializer';
import { transitUserRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transit user id');

  const transitUserRepository = getRepository(TransitUser);
  const user = await transitUserRepository.findOne(id, {
    relations: transitUserRelations,
  });

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
  }

  const userGpsLogRepository = getRepository(UserGpsLog);
  const lastGpsLog = await userGpsLogRepository.findOne({
    where: { user },
    order: { capturedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Transit user fetched.', serializeTransitUser(user, lastGpsLog ?? null));
};
