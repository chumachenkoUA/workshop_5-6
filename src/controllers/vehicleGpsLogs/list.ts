import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';

import { serializeVehicleGpsLog } from './serializer';
import { vehicleGpsLogRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const vehicleGpsLogRepository = getRepository(VehicleGpsLog);

  const logs = await vehicleGpsLogRepository.find({
    relations: vehicleGpsLogRelations,
    order: { capturedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Vehicle GPS logs fetched.', logs.map(serializeVehicleGpsLog));
};
