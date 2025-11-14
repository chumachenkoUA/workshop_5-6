import { Request, Response } from 'express';

import { VehicleResponseDTO } from 'dto/vehicles/VehicleResponseDTO';
import { VehicleService } from 'services/vehicles/VehicleService';

export const list = async (req: Request, res: Response) => {
  const vehicleService = new VehicleService();
  const vehicles = await vehicleService.findAll();

  return res.customSuccess(
    200,
    'Vehicles fetched.',
    vehicles.map((vehicle) => new VehicleResponseDTO(vehicle)),
  );
};
