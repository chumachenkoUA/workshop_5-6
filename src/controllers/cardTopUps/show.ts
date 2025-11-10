import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { CardTopUp } from 'orm/entities/transit/CardTopUp';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeCardTopUp } from './serializer';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Card top-up id');

  const cardTopUpRepository = getRepository(CardTopUp);
  const topUp = await cardTopUpRepository.findOne(id, {
    relations: ['card', 'card.user'],
  });

  if (!topUp) {
    throw new CustomError(404, 'General', `Card top-up with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Card top-up fetched.', serializeCardTopUp(topUp));
};
