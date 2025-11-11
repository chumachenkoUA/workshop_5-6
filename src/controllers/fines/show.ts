import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeFine } from './serializer';
import { fineRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Fine id');

  const fineRepository = getRepository(Fine);
  const fine = await fineRepository.findOne(id, {
    relations: fineRelations,
  });

  if (!fine) {
    throw new CustomError(404, 'General', `Fine with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Fine fetched.', serializeFine(fine));
};
