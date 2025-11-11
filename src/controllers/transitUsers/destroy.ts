import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transit user id');

  const transitUserRepository = getRepository(TransitUser);
  const deleteResult = await transitUserRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Transit user deleted.');
};
