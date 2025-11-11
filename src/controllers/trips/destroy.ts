import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Trip id');

  const tripRepository = getRepository(Trip);
  const deleteResult = await tripRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Trip with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Trip deleted.');
};
