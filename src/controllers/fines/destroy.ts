import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Fine id');

  const fineRepository = getRepository(Fine);
  const deleteResult = await fineRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Fine with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Fine deleted.');
};
