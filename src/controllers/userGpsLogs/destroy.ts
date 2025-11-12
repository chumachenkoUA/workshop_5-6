import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'User GPS log id');

  const userGpsLogRepository = getRepository(UserGpsLog);
  const deleteResult = await userGpsLogRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `User GPS log with id:${id} not found.`);
  }

  return res.customSuccess(200, 'User GPS log deleted.');
};
