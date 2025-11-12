import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Vehicle } from 'orm/entities/transit/Vehicle';

import { serializeVehicle } from './serializer';
import { vehicleRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const vehicleRepository = getRepository(Vehicle);

  const vehicles = await vehicleRepository.find({
    relations: vehicleRelations,
    order: { id: 'ASC' },
  });

  return res.customSuccess(200, 'Vehicles fetched.', vehicles.map(serializeVehicle));
};
