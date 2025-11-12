import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { TransportType } from 'orm/entities/transit/TransportType';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeVehicle } from './serializer';
import { vehicleRelations } from './shared';
import {
  normalizeBoardNumber,
  normalizeCapacity,
  normalizeIdParam,
  normalizeRouteId,
  normalizeTransportTypeId,
} from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Vehicle id');
  const boardNumber = normalizeBoardNumber(req.body.boardNumber);
  const capacity = normalizeCapacity(req.body.capacity);
  const transportTypeId = normalizeTransportTypeId(req.body.transportTypeId);
  const routeId = normalizeRouteId(req.body.routeId);

  const vehicleRepository = getRepository(Vehicle);
  const vehicle = await vehicleRepository.findOne(id, { relations: vehicleRelations });

  if (!vehicle) {
    throw new CustomError(404, 'General', `Vehicle with id:${id} not found.`);
  }

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

  vehicle.boardNumber = boardNumber;
  vehicle.capacity = capacity;
  vehicle.transportType = transportType;
  vehicle.route = route;

  await vehicleRepository.save(vehicle);

  return res.customSuccess(200, 'Vehicle updated.', serializeVehicle(vehicle));
};
