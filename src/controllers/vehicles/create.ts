import { Request, Response } from 'express';

import { VehicleResponseDTO } from 'dto/vehicles/VehicleResponseDTO';
import { VehicleService } from 'services/vehicles/VehicleService';

export const create = async (req: Request, res: Response) => {
  const vehicleService = new VehicleService();
  const vehicle = await vehicleService.create({
    boardNumber: req.body.boardNumber,
    capacity: req.body.capacity,
    transportTypeId: req.body.transportTypeId,
    routeId: req.body.routeId,
  });

  return res.customSuccess(201, 'Vehicle created.', new VehicleResponseDTO(vehicle));
};
