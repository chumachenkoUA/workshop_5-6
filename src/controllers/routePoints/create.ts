import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { RoutePoint } from 'orm/entities/transit/RoutePoint';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { resolveRoutePointReference } from './helpers';
import { serializeRoutePoint } from './serializer';
import { routePointRelations } from './shared';
import { normalizeCoordinate, normalizeOptionalPointId, normalizeRouteId } from './validators';

export const create = async (req: Request, res: Response) => {
  const routeId = normalizeRouteId(req.body.routeId);
  const latitude = normalizeCoordinate(req.body.latitude, 'Latitude');
  const longitude = normalizeCoordinate(req.body.longitude, 'Longitude');
  const previousPointId = normalizeOptionalPointId(req.body.previousPointId, 'Previous point id');
  const nextPointId = normalizeOptionalPointId(req.body.nextPointId, 'Next point id');

  const routeRepository = getRepository(Route);
  const route = await routeRepository.findOne(routeId, { relations: ['transportType'] });

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  const [previousPoint, nextPoint] = await Promise.all([
    resolveRoutePointReference(previousPointId, 'Previous route point'),
    resolveRoutePointReference(nextPointId, 'Next route point'),
  ]);

  const routePointRepository = getRepository(RoutePoint);
  const point = routePointRepository.create({
    route,
    latitude,
    longitude,
    previousPoint,
    nextPoint,
  });

  await routePointRepository.save(point);

  const createdPoint = await routePointRepository.findOne(point.id, {
    relations: routePointRelations,
  });

  if (!createdPoint) {
    throw new CustomError(500, 'General', 'Route point could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Route point created.', serializeRoutePoint(createdPoint));
};
