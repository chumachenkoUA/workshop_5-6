import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeStop } from './serializer';
import { stopRelations } from './shared';
import { normalizeIdParam, normalizeLatitude, normalizeLongitude, normalizeName } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Stop id');
  const name = normalizeName(req.body.name);
  const latitude = normalizeLatitude(req.body.latitude);
  const longitude = normalizeLongitude(req.body.longitude);

  const stopRepository = getRepository(Stop);
  const stop = await stopRepository.findOne(id, {
    relations: stopRelations,
  });

  if (!stop) {
    throw new CustomError(404, 'General', `Stop with id:${id} not found.`);
  }

  stop.name = name;
  stop.latitude = latitude;
  stop.longitude = longitude;

  await stopRepository.save(stop);

  return res.customSuccess(200, 'Stop updated.', serializeStop(stop));
};
