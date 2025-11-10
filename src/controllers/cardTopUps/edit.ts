import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { CardTopUp } from 'orm/entities/transit/CardTopUp';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeCardTopUp } from './serializer';
import { normalizeAmountInput, normalizeIdParam } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Card top-up id');
  const amount = normalizeAmountInput(req.body.amount);

  const cardTopUpRepository = getRepository(CardTopUp);
  const topUp = await cardTopUpRepository.findOne(id, {
    relations: ['card', 'card.user'],
  });

  if (!topUp) {
    throw new CustomError(404, 'General', `Card top-up with id:${id} not found.`);
  }

  topUp.amount = amount;
  await cardTopUpRepository.save(topUp);

  return res.customSuccess(200, 'Card top-up updated.', serializeCardTopUp(topUp));
};
