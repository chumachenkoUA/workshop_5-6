import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeVehicle } from './serializer';
import { vehicleRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Vehicle id');

  const vehicleRepository = getRepository(Vehicle);
  const vehicle = await vehicleRepository.findOne(id, {
    relations: vehicleRelations,
  });

  if (!vehicle) {
    throw new CustomError(404, 'General', `Vehicle with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Vehicle fetched.', serializeVehicle(vehicle));
};
