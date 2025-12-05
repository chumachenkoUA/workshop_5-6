import { Request, Response } from 'express';

import { VehicleResponseDTO } from 'dto/vehicles/VehicleResponseDTO';
import { VehicleService } from 'services/vehicles/VehicleService';

export const show = async (req: Request, res: Response) => {
  const vehicleService = new VehicleService();
  const vehicle = await vehicleService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Vehicle fetched.', new VehicleResponseDTO(vehicle));
};
