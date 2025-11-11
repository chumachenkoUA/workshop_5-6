import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeStop } from './serializer';
import { stopRelations } from './shared';
import { normalizeLatitude, normalizeLongitude, normalizeName } from './validators';

export const create = async (req: Request, res: Response) => {
  const name = normalizeName(req.body.name);
  const latitude = normalizeLatitude(req.body.latitude);
  const longitude = normalizeLongitude(req.body.longitude);

  const stopRepository = getRepository(Stop);
  const stop = stopRepository.create({
    name,
    latitude,
    longitude,
  });

  await stopRepository.save(stop);

  const createdStop = await stopRepository.findOne(stop.id, {
    relations: stopRelations,
  });

  if (!createdStop) {
    throw new CustomError(500, 'General', 'Stop could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Stop created.', serializeStop(createdStop));
};
