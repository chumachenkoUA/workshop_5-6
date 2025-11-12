import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Vehicle GPS log id');

  const vehicleGpsLogRepository = getRepository(VehicleGpsLog);
  const deleteResult = await vehicleGpsLogRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Vehicle GPS log with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Vehicle GPS log deleted.');
};
