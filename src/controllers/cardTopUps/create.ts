import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { CardTopUp } from 'orm/entities/transit/CardTopUp';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeCardTopUp } from './serializer';
import { normalizeAmountInput, normalizeIdParam } from './validators';

export const create = async (req: Request, res: Response) => {
  const cardId = normalizeIdParam(req.body.cardId, 'Card id');
  const amount = normalizeAmountInput(req.body.amount);

  const transportCardRepository = getRepository(TransportCard);
  const card = await transportCardRepository.findOne(cardId, { relations: ['user'] });

  if (!card) {
    throw new CustomError(404, 'General', `Transport card with id:${cardId} not found.`);
  }

  const cardTopUpRepository = getRepository(CardTopUp);
  const topUp = cardTopUpRepository.create({
    card,
    amount,
  });

  await cardTopUpRepository.save(topUp);

  const createdTopUp = await cardTopUpRepository.findOne(topUp.id, {
    relations: ['card', 'card.user'],
  });

  if (!createdTopUp) {
    throw new CustomError(500, 'General', 'Card top-up could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Card top-up created.', serializeCardTopUp(createdTopUp));
};
