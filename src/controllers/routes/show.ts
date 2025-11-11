import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeRoute } from './serializer';
import { routeRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route id');

  const routeRepository = getRepository(Route);
  const route = await routeRepository.findOne(id, { relations: routeRelations });

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Route fetched.', serializeRoute(route));
};
