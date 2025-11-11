import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransportCard } from './serializer';
import { transportCardRelations } from './shared';
import { normalizeBalance, normalizeNumberField, normalizeUserId } from './validators';

export const create = async (req: Request, res: Response) => {
  const userId = normalizeUserId(req.body.userId);
  const number = normalizeNumberField(req.body.number);
  const balance = normalizeBalance(req.body.balance);

  const transitUserRepository = getRepository(TransitUser);
  const user = await transitUserRepository.findOne(userId, { relations: ['transportCard'] });

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
  }

  if (user.transportCard) {
    throw new CustomError(409, 'General', `Transit user with id:${userId} already has a transport card.`);
  }

  const transportCardRepository = getRepository(TransportCard);
  const card = transportCardRepository.create({
    user,
    number,
    balance,
  });

  await transportCardRepository.save(card);

  const createdCard = await transportCardRepository.findOne(card.id, {
    relations: transportCardRelations,
  });

  if (!createdCard) {
    throw new CustomError(500, 'General', 'Transport card could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Transport card created.', serializeTransportCard(createdCard));
};
