import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportCard } from 'orm/entities/transit/TransportCard';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport card id');

  const transportCardRepository = getRepository(TransportCard);
  const deleteResult = await transportCardRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Transport card with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Transport card deleted.');
};
