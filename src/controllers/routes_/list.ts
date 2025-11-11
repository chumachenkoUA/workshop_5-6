import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';

import { serializeRoute } from './serializer';
import { routeRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const routeRepository = getRepository(Route);

  const routes = await routeRepository.find({
    relations: routeRelations,
    order: { id: 'DESC' },
  });

  return res.customSuccess(200, 'Routes fetched.', routes.map(serializeRoute));
};
