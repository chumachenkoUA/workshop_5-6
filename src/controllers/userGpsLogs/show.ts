import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeUserGpsLog } from './serializer';
import { userGpsLogRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'User GPS log id');

  const userGpsLogRepository = getRepository(UserGpsLog);
  const log = await userGpsLogRepository.findOne(id, {
    relations: userGpsLogRelations,
  });

  if (!log) {
    throw new CustomError(404, 'General', `User GPS log with id:${id} not found.`);
  }

  return res.customSuccess(200, 'User GPS log fetched.', serializeUserGpsLog(log));
};
