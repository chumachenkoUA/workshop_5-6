import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { CardTopUp } from 'orm/entities/transit/CardTopUp';

import { serializeCardTopUp } from './serializer';

export const list = async (req: Request, res: Response) => {
  const cardTopUpRepository = getRepository(CardTopUp);

  const topUps = await cardTopUpRepository.find({
    relations: ['card', 'card.user'],
    order: { rechargedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Card top-ups fetched.', topUps.map(serializeCardTopUp));
};
