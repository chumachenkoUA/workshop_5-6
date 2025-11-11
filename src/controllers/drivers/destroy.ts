import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Driver id');

  const driverRepository = getRepository(Driver);
  const deleteResult = await driverRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Driver with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Driver deleted.');
};
