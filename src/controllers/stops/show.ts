import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeStop } from './serializer';
import { stopRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Stop id');

  const stopRepository = getRepository(Stop);
  const stop = await stopRepository.findOne(id, {
    relations: stopRelations,
  });

  if (!stop) {
    throw new CustomError(404, 'General', `Stop with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Stop fetched.', serializeStop(stop));
};
