import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { FineAppeal } from 'orm/entities/transit/FineAppeal';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Fine appeal id');

  const fineAppealRepository = getRepository(FineAppeal);
  const deleteResult = await fineAppealRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Fine appeal with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Fine appeal deleted.');
};
