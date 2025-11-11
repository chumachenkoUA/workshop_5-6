import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';

import { serializeFine } from './serializer';
import { fineRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const fineRepository = getRepository(Fine);

  const fines = await fineRepository.find({
    relations: fineRelations,
    order: { issuedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Fines fetched.', fines.map(serializeFine));
};
