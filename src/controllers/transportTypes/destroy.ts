import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport type id');

  const transportTypeRepository = getRepository(TransportType);
  const deleteResult = await transportTypeRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Transport type with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Transport type deleted.');
};
