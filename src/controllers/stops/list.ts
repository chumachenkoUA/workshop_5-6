import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Stop } from 'orm/entities/transit/Stop';

import { serializeStop } from './serializer';
import { stopRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const stopRepository = getRepository(Stop);

  const stops = await stopRepository.find({
    relations: stopRelations,
    order: { id: 'ASC' },
  });

  return res.customSuccess(200, 'Stops fetched.', stops.map(serializeStop));
};
