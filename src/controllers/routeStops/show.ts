import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { RouteStop } from 'orm/entities/transit/RouteStop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeRouteStop } from './serializer';
import { routeStopRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route stop id');

  const routeStopRepository = getRepository(RouteStop);
  const routeStop = await routeStopRepository.findOne(id, {
    relations: routeStopRelations,
  });

  if (!routeStop) {
    throw new CustomError(404, 'General', `Route stop with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Route stop fetched.', serializeRouteStop(routeStop));
};
