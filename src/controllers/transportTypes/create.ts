import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransportType } from './serializer';
import { transportTypeRelations } from './shared';
import { normalizeName } from './validators';

export const create = async (req: Request, res: Response) => {
  const name = normalizeName(req.body.name);

  const transportTypeRepository = getRepository(TransportType);
  const transportType = transportTypeRepository.create({
    name,
  });

  await transportTypeRepository.save(transportType);

  const createdTransportType = await transportTypeRepository.findOne(transportType.id, {
    relations: transportTypeRelations,
  });

  if (!createdTransportType) {
    throw new CustomError(500, 'General', 'Transport type could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Transport type created.', serializeTransportType(createdTransportType));
};
