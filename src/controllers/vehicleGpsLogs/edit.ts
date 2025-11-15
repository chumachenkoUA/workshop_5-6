import { Request, Response } from 'express';

import { VehicleGpsLogResponseDTO } from 'dto/vehicleGpsLogs/VehicleGpsLogResponseDTO';
import { VehicleGpsLogService } from 'services/vehicleGpsLogs/VehicleGpsLogService';

export const edit = async (req: Request, res: Response) => {
  const vehicleGpsLogService = new VehicleGpsLogService();
  const log = await vehicleGpsLogService.update(req.params.id, {
    vehicleId: req.body.vehicleId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  return res.customSuccess(200, 'Vehicle GPS log updated.', new VehicleGpsLogResponseDTO(log));
};
