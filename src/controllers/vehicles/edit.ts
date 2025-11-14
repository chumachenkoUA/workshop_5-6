import { Request, Response } from 'express';

import { VehicleResponseDTO } from 'dto/vehicles/VehicleResponseDTO';
import { VehicleService } from 'services/vehicles/VehicleService';

export const edit = async (req: Request, res: Response) => {
  const vehicleService = new VehicleService();
  const vehicle = await vehicleService.update(req.params.id, {
    boardNumber: req.body.boardNumber,
    capacity: req.body.capacity,
    transportTypeId: req.body.transportTypeId,
    routeId: req.body.routeId,
  });

  return res.customSuccess(200, 'Vehicle updated.', new VehicleResponseDTO(vehicle));
};
