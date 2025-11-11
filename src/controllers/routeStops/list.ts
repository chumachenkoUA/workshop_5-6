import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { RouteStop } from 'orm/entities/transit/RouteStop';

import { serializeRouteStop } from './serializer';
import { routeStopRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const routeStopRepository = getRepository(RouteStop);

  const routeStops = await routeStopRepository.find({
    relations: routeStopRelations,
    order: { id: 'ASC' },
  });

  return res.customSuccess(200, 'Route stops fetched.', routeStops.map(serializeRouteStop));
};
