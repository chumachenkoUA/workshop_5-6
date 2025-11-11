import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTrip } from './serializer';
import { tripRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Trip id');

  const tripRepository = getRepository(Trip);
  const trip = await tripRepository.findOne(id, {
    relations: tripRelations,
  });

  if (!trip) {
    throw new CustomError(404, 'General', `Trip with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Trip fetched.', serializeTrip(trip));
};
