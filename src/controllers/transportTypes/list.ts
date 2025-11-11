import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransportType } from 'orm/entities/transit/TransportType';

import { serializeTransportType } from './serializer';
import { transportTypeRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const transportTypeRepository = getRepository(TransportType);

  const transportTypes = await transportTypeRepository.find({
    relations: transportTypeRelations,
    order: { id: 'ASC' },
  });

  return res.customSuccess(200, 'Transport types fetched.', transportTypes.map(serializeTransportType));
};
