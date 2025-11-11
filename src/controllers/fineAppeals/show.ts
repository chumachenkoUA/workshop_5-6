import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { FineAppeal } from 'orm/entities/transit/FineAppeal';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeFineAppeal } from './serializer';
import { fineAppealRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Fine appeal id');

  const fineAppealRepository = getRepository(FineAppeal);
  const appeal = await fineAppealRepository.findOne(id, {
    relations: fineAppealRelations,
  });

  if (!appeal) {
    throw new CustomError(404, 'General', `Fine appeal with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Fine appeal fetched.', serializeFineAppeal(appeal));
};
