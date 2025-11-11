import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { Route } from 'orm/entities/transit/Route';
import { Trip } from 'orm/entities/transit/Trip';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTrip } from './serializer';
import { tripRelations } from './shared';
import {
  normalizeDate,
  normalizeDriverId,
  normalizePassengerCount,
  normalizeRouteId,
  normalizeVehicleId,
} from './validators';

export const create = async (req: Request, res: Response) => {
  const routeId = normalizeRouteId(req.body.routeId);
  const vehicleId = normalizeVehicleId(req.body.vehicleId);
  const driverId = normalizeDriverId(req.body.driverId);
  const startedAt = normalizeDate(req.body.startedAt, 'Started at');
  const endedAt = normalizeDate(req.body.endedAt, 'Ended at');
  const passengerCount = normalizePassengerCount(req.body.passengerCount ?? 0);

  if (endedAt <= startedAt) {
    throw new CustomError(422, 'Validation', 'Ended at must be greater than started at.');
  }

  const routeRepository = getRepository(Route);
  const vehicleRepository = getRepository(Vehicle);
  const driverRepository = getRepository(Driver);

  const [route, vehicle, driver] = await Promise.all([
    routeRepository.findOne(routeId),
    vehicleRepository.findOne(vehicleId),
    driverRepository.findOne(driverId),
  ]);

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  if (!vehicle) {
    throw new CustomError(404, 'General', `Vehicle with id:${vehicleId} not found.`);
  }

  if (!driver) {
    throw new CustomError(404, 'General', `Driver with id:${driverId} not found.`);
  }

  const tripRepository = getRepository(Trip);
  const trip = tripRepository.create({
    route,
    vehicle,
    driver,
    startedAt,
    endedAt,
    passengerCount,
  });

  await tripRepository.save(trip);

  const createdTrip = await tripRepository.findOne(trip.id, {
    relations: tripRelations,
  });

  if (!createdTrip) {
    throw new CustomError(500, 'General', 'Trip could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Trip created.', serializeTrip(createdTrip));
};
