import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportCard } from 'orm/entities/transit/TransportCard';

import { serializeTransportCard } from './serializer';
import { transportCardRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const transportCardRepository = getRepository(TransportCard);

  const cards = await transportCardRepository.find({
    relations: transportCardRelations,
    order: { id: 'DESC' },
  });

  return res.customSuccess(200, 'Transport cards fetched.', cards.map(serializeTransportCard));
};
