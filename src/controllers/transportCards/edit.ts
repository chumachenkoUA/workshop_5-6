import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransportCard } from './serializer';
import { transportCardRelations } from './shared';
import { normalizeBalance, normalizeIdParam, normalizeNumberField, normalizeUserId } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport card id');
  const userId = normalizeUserId(req.body.userId);
  const number = normalizeNumberField(req.body.number);
  const balance = normalizeBalance(req.body.balance);

  const transportCardRepository = getRepository(TransportCard);
  const card = await transportCardRepository.findOne(id, {
    relations: transportCardRelations,
  });

  if (!card) {
    throw new CustomError(404, 'General', `Transport card with id:${id} not found.`);
  }

  const transitUserRepository = getRepository(TransitUser);
  const user = await transitUserRepository.findOne(userId, { relations: ['transportCard'] });

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
  }

  if (user.transportCard && user.transportCard.id !== card.id) {
    throw new CustomError(409, 'General', `Transit user with id:${userId} already has another transport card.`);
  }

  card.user = user;
  card.number = number;
  card.balance = balance;

  await transportCardRepository.save(card);

  return res.customSuccess(200, 'Transport card updated.', serializeTransportCard(card));
};
