import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Vehicle } from 'orm/entities/transit/Vehicle';
import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeVehicleGpsLog } from './serializer';
import { vehicleGpsLogRelations } from './shared';
import { normalizeLatitude, normalizeLongitude, normalizeVehicleId } from './validators';

export const create = async (req: Request, res: Response) => {
  const vehicleId = normalizeVehicleId(req.body.vehicleId);
  const latitude = normalizeLatitude(req.body.latitude);
  const longitude = normalizeLongitude(req.body.longitude);

  const vehicleRepository = getRepository(Vehicle);
  const vehicle = await vehicleRepository.findOne(vehicleId);

  if (!vehicle) {
    throw new CustomError(404, 'General', `Vehicle with id:${vehicleId} not found.`);
  }

  const vehicleGpsLogRepository = getRepository(VehicleGpsLog);
  const log = vehicleGpsLogRepository.create({
    vehicle,
    latitude,
    longitude,
  });

  await vehicleGpsLogRepository.save(log);

  const createdLog = await vehicleGpsLogRepository.findOne(log.id, {
    relations: vehicleGpsLogRelations,
  });

  if (!createdLog) {
    throw new CustomError(500, 'General', 'Vehicle GPS log could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Vehicle GPS log created.', serializeVehicleGpsLog(createdLog));
};
