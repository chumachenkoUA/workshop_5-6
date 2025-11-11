import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { RouteStop } from 'orm/entities/transit/RouteStop';
import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { resolveRouteStopReference } from './helpers';
import { serializeRouteStop } from './serializer';
import { routeStopRelations } from './shared';
import { normalizeOptionalRouteStopId, normalizeRouteId, normalizeStopId } from './validators';

export const create = async (req: Request, res: Response) => {
  const routeId = normalizeRouteId(req.body.routeId);
  const stopId = normalizeStopId(req.body.stopId);
  const previousStopId = normalizeOptionalRouteStopId(req.body.previousRouteStopId, 'Previous route stop id');
  const nextStopId = normalizeOptionalRouteStopId(req.body.nextRouteStopId, 'Next route stop id');

  const routeRepository = getRepository(Route);
  const stopRepository = getRepository(Stop);

  const [route, stop] = await Promise.all([
    routeRepository.findOne(routeId, { relations: ['transportType'] }),
    stopRepository.findOne(stopId),
  ]);

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  if (!stop) {
    throw new CustomError(404, 'General', `Stop with id:${stopId} not found.`);
  }

  const [previousStop, nextStop] = await Promise.all([
    resolveRouteStopReference(previousStopId, 'Previous route stop'),
    resolveRouteStopReference(nextStopId, 'Next route stop'),
  ]);

  const routeStopRepository = getRepository(RouteStop);
  const routeStop = routeStopRepository.create({
    route,
    stop,
    previousStop,
    nextStop,
  });

  await routeStopRepository.save(routeStop);

  const createdRouteStop = await routeStopRepository.findOne(routeStop.id, {
    relations: routeStopRelations,
  });

  if (!createdRouteStop) {
    throw new CustomError(500, 'General', 'Route stop could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Route stop created.', serializeRouteStop(createdRouteStop));
};
