import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';

import { serializeDriver } from './serializer';
import { driverRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const driverRepository = getRepository(Driver);

  const drivers = await driverRepository.find({
    relations: driverRelations,
    order: { id: 'DESC' },
  });

  return res.customSuccess(200, 'Drivers fetched.', drivers.map(serializeDriver));
};
