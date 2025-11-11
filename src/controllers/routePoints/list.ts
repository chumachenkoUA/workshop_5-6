import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { RoutePoint } from 'orm/entities/transit/RoutePoint';

import { serializeRoutePoint } from './serializer';
import { routePointRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const routePointRepository = getRepository(RoutePoint);

  const points = await routePointRepository.find({
    relations: routePointRelations,
    order: { id: 'ASC' },
  });

  return res.customSuccess(200, 'Route points fetched.', points.map(serializeRoutePoint));
};
