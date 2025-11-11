import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { FineAppeal } from 'orm/entities/transit/FineAppeal';

import { serializeFineAppeal } from './serializer';
import { fineAppealRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const fineAppealRepository = getRepository(FineAppeal);

  const appeals = await fineAppealRepository.find({
    relations: fineAppealRelations,
    order: { createdAt: 'DESC' },
  });

  return res.customSuccess(200, 'Fine appeals fetched.', appeals.map(serializeFineAppeal));
};
