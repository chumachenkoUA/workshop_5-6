import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { TransportType } from 'orm/entities/transit/TransportType';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeVehicle } from './serializer';
import { vehicleRelations } from './shared';
import { normalizeBoardNumber, normalizeCapacity, normalizeRouteId, normalizeTransportTypeId } from './validators';

export const create = async (req: Request, res: Response) => {
  const boardNumber = normalizeBoardNumber(req.body.boardNumber);
  const capacity = normalizeCapacity(req.body.capacity);
  const transportTypeId = normalizeTransportTypeId(req.body.transportTypeId);
  const routeId = normalizeRouteId(req.body.routeId);

  const transportTypeRepository = getRepository(TransportType);
  const routeRepository = getRepository(Route);

  const [transportType, route] = await Promise.all([
    transportTypeRepository.findOne(transportTypeId),
    routeRepository.findOne(routeId),
  ]);

  if (!transportType) {
    throw new CustomError(404, 'General', `Transport type with id:${transportTypeId} not found.`);
  }

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  const vehicleRepository = getRepository(Vehicle);
  const vehicle = vehicleRepository.create({
    boardNumber,
    capacity,
    transportType,
    route,
  });

  await vehicleRepository.save(vehicle);

  const createdVehicle = await vehicleRepository.findOne(vehicle.id, {
    relations: vehicleRelations,
  });

  if (!createdVehicle) {
    throw new CustomError(500, 'General', 'Vehicle could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Vehicle created.', serializeVehicle(createdVehicle));
};
