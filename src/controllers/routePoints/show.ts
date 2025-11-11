import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { RoutePoint } from 'orm/entities/transit/RoutePoint';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeRoutePoint } from './serializer';
import { routePointRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route point id');

  const routePointRepository = getRepository(RoutePoint);
  const point = await routePointRepository.findOne(id, {
    relations: routePointRelations,
  });

  if (!point) {
    throw new CustomError(404, 'General', `Route point with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Route point fetched.', serializeRoutePoint(point));
};
