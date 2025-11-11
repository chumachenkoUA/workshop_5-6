import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeDriver } from './serializer';
import { driverRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Driver id');

  const driverRepository = getRepository(Driver);
  const driver = await driverRepository.findOne(id, { relations: driverRelations });

  if (!driver) {
    throw new CustomError(404, 'General', `Driver with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Driver fetched.', serializeDriver(driver));
};
