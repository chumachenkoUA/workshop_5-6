import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route id');

  const routeRepository = getRepository(Route);
  const deleteResult = await routeRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Route with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Route deleted.');
};
