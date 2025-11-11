import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { TransitUser } from 'orm/entities/transit/TransitUser';
import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeFine } from './serializer';
import { fineRelations } from './shared';
import { normalizeIdParam, normalizeStatus } from './validators';

export const create = async (req: Request, res: Response) => {
  const userId = normalizeIdParam(req.body.userId, 'User id');
  const tripId = normalizeIdParam(req.body.tripId, 'Trip id');
  const status = normalizeStatus(req.body.status);

  const userRepository = getRepository(TransitUser);
  const tripRepository = getRepository(Trip);

  const [user, trip] = await Promise.all([
    userRepository.findOne(userId),
    tripRepository.findOne(tripId, { relations: ['route'] }),
  ]);

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
  }

  if (!trip) {
    throw new CustomError(404, 'General', `Trip with id:${tripId} not found.`);
  }

  const fineRepository = getRepository(Fine);
  const fine = fineRepository.create({
    user,
    trip,
    status,
  });

  await fineRepository.save(fine);

  const createdFine = await fineRepository.findOne(fine.id, {
    relations: fineRelations,
  });

  if (!createdFine) {
    throw new CustomError(500, 'General', 'Fine could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Fine created.', serializeFine(createdFine));
};
