import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeVehicleGpsLog } from './serializer';
import { vehicleGpsLogRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Vehicle GPS log id');

  const vehicleGpsLogRepository = getRepository(VehicleGpsLog);
  const log = await vehicleGpsLogRepository.findOne(id, {
    relations: vehicleGpsLogRelations,
  });

  if (!log) {
    throw new CustomError(404, 'General', `Vehicle GPS log with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Vehicle GPS log fetched.', serializeVehicleGpsLog(log));
};
