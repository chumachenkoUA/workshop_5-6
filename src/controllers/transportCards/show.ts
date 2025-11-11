import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportCard } from 'orm/entities/transit/TransportCard';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransportCard } from './serializer';
import { transportCardRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport card id');

  const transportCardRepository = getRepository(TransportCard);
  const card = await transportCardRepository.findOne(id, {
    relations: transportCardRelations,
  });

  if (!card) {
    throw new CustomError(404, 'General', `Transport card with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Transport card fetched.', serializeTransportCard(card));
};
