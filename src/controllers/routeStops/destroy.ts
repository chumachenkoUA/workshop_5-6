import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { RouteStop } from 'orm/entities/transit/RouteStop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route stop id');

  const routeStopRepository = getRepository(RouteStop);
  const deleteResult = await routeStopRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Route stop with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Route stop deleted.');
};
