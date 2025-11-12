import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Vehicle id');

  const vehicleRepository = getRepository(Vehicle);
  const deleteResult = await vehicleRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Vehicle with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Vehicle deleted.');
};
