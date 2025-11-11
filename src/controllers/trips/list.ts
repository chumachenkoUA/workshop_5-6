import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Trip } from 'orm/entities/transit/Trip';

import { serializeTrip } from './serializer';
import { tripRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const tripRepository = getRepository(Trip);

  const trips = await tripRepository.find({
    relations: tripRelations,
    order: { startedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Trips fetched.', trips.map(serializeTrip));
};
