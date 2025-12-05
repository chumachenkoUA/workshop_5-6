import { Request, Response } from 'express';

import { VehicleGpsLogResponseDTO } from 'dto/vehicleGpsLogs/VehicleGpsLogResponseDTO';
import { VehicleGpsLogService } from 'services/vehicleGpsLogs/VehicleGpsLogService';

export const create = async (req: Request, res: Response) => {
  const vehicleGpsLogService = new VehicleGpsLogService();
  const log = await vehicleGpsLogService.create({
    vehicleId: req.body.vehicleId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  return res.customSuccess(201, 'Vehicle GPS log created.', new VehicleGpsLogResponseDTO(log));
};
