import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransportType } from './serializer';
import { transportTypeRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport type id');

  const transportTypeRepository = getRepository(TransportType);
  const transportType = await transportTypeRepository.findOne(id, {
    relations: transportTypeRelations,
  });

  if (!transportType) {
    throw new CustomError(404, 'General', `Transport type with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Transport type fetched.', serializeTransportType(transportType));
};
