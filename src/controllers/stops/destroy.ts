import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Stop id');

  const stopRepository = getRepository(Stop);
  const deleteResult = await stopRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Stop with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Stop deleted.');
};
