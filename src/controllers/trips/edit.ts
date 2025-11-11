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
  normalizeIdParam,
  normalizePassengerCount,
  normalizeRouteId,
  normalizeVehicleId,
} from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Trip id');
  const routeId = normalizeRouteId(req.body.routeId);
  const vehicleId = normalizeVehicleId(req.body.vehicleId);
  const driverId = normalizeDriverId(req.body.driverId);
  const startedAt = normalizeDate(req.body.startedAt, 'Started at');
  const endedAt = normalizeDate(req.body.endedAt, 'Ended at');
  const passengerCount = normalizePassengerCount(req.body.passengerCount ?? 0);

  if (endedAt <= startedAt) {
    throw new CustomError(422, 'Validation', 'Ended at must be greater than started at.');
  }

  const tripRepository = getRepository(Trip);
  const trip = await tripRepository.findOne(id, {
    relations: tripRelations,
  });

  if (!trip) {
    throw new CustomError(404, 'General', `Trip with id:${id} not found.`);
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

  trip.route = route;
  trip.vehicle = vehicle;
  trip.driver = driver;
  trip.startedAt = startedAt;
  trip.endedAt = endedAt;
  trip.passengerCount = passengerCount;

  await tripRepository.save(trip);

  return res.customSuccess(200, 'Trip updated.', serializeTrip(trip));
};
