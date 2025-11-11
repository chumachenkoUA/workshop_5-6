import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransportType } from './serializer';
import { transportTypeRelations } from './shared';
import { normalizeIdParam, normalizeName } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport type id');
  const name = normalizeName(req.body.name);

  const transportTypeRepository = getRepository(TransportType);
  const transportType = await transportTypeRepository.findOne(id, {
    relations: transportTypeRelations,
  });

  if (!transportType) {
    throw new CustomError(404, 'General', `Transport type with id:${id} not found.`);
  }

  transportType.name = name;

  await transportTypeRepository.save(transportType);

  return res.customSuccess(200, 'Transport type updated.', serializeTransportType(transportType));
};
