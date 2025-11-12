import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Vehicle } from 'orm/entities/transit/Vehicle';
import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeVehicleGpsLog } from './serializer';
import { vehicleGpsLogRelations } from './shared';
import { normalizeIdParam, normalizeLatitude, normalizeLongitude, normalizeVehicleId } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Vehicle GPS log id');
  const vehicleId = normalizeVehicleId(req.body.vehicleId);
  const latitude = normalizeLatitude(req.body.latitude);
  const longitude = normalizeLongitude(req.body.longitude);

  const vehicleGpsLogRepository = getRepository(VehicleGpsLog);
  const log = await vehicleGpsLogRepository.findOne(id, {
    relations: vehicleGpsLogRelations,
  });

  if (!log) {
    throw new CustomError(404, 'General', `Vehicle GPS log with id:${id} not found.`);
  }

  const vehicleRepository = getRepository(Vehicle);
  const vehicle = await vehicleRepository.findOne(vehicleId);

  if (!vehicle) {
    throw new CustomError(404, 'General', `Vehicle with id:${vehicleId} not found.`);
  }

  log.vehicle = vehicle;
  log.latitude = latitude;
  log.longitude = longitude;

  await vehicleGpsLogRepository.save(log);

  return res.customSuccess(200, 'Vehicle GPS log updated.', serializeVehicleGpsLog(log));
};
