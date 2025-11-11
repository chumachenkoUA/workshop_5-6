import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { RouteStop } from 'orm/entities/transit/RouteStop';
import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { resolveRouteStopReference } from './helpers';
import { serializeRouteStop } from './serializer';
import { routeStopRelations } from './shared';
import { normalizeIdParam, normalizeOptionalRouteStopId, normalizeRouteId, normalizeStopId } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route stop id');
  const routeId = normalizeRouteId(req.body.routeId);
  const stopId = normalizeStopId(req.body.stopId);
  const previousStopId = normalizeOptionalRouteStopId(req.body.previousRouteStopId, 'Previous route stop id');
  const nextStopId = normalizeOptionalRouteStopId(req.body.nextRouteStopId, 'Next route stop id');

  const routeStopRepository = getRepository(RouteStop);
  const routeStop = await routeStopRepository.findOne(id, {
    relations: routeStopRelations,
  });

  if (!routeStop) {
    throw new CustomError(404, 'General', `Route stop with id:${id} not found.`);
  }

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

  routeStop.route = route;
  routeStop.stop = stop;
  routeStop.previousStop = previousStop;
  routeStop.nextStop = nextStop;

  await routeStopRepository.save(routeStop);

  return res.customSuccess(200, 'Route stop updated.', serializeRouteStop(routeStop));
};
