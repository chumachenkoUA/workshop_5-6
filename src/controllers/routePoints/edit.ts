import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { RoutePoint } from 'orm/entities/transit/RoutePoint';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { resolveRoutePointReference } from './helpers';
import { serializeRoutePoint } from './serializer';
import { routePointRelations } from './shared';
import { normalizeCoordinate, normalizeIdParam, normalizeOptionalPointId, normalizeRouteId } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route point id');
  const routeId = normalizeRouteId(req.body.routeId);
  const latitude = normalizeCoordinate(req.body.latitude, 'Latitude');
  const longitude = normalizeCoordinate(req.body.longitude, 'Longitude');
  const previousPointId = normalizeOptionalPointId(req.body.previousPointId, 'Previous point id');
  const nextPointId = normalizeOptionalPointId(req.body.nextPointId, 'Next point id');

  const routePointRepository = getRepository(RoutePoint);
  const point = await routePointRepository.findOne(id, {
    relations: routePointRelations,
  });

  if (!point) {
    throw new CustomError(404, 'General', `Route point with id:${id} not found.`);
  }

  const routeRepository = getRepository(Route);
  const route = await routeRepository.findOne(routeId, { relations: ['transportType'] });

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  const [previousPoint, nextPoint] = await Promise.all([
    resolveRoutePointReference(previousPointId, 'Previous route point'),
    resolveRoutePointReference(nextPointId, 'Next route point'),
  ]);

  point.route = route;
  point.latitude = latitude;
  point.longitude = longitude;
  point.previousPoint = previousPoint;
  point.nextPoint = nextPoint;

  await routePointRepository.save(point);

  return res.customSuccess(200, 'Route point updated.', serializeRoutePoint(point));
};
