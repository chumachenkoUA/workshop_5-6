import { Request, Response } from 'express';

import { VehicleGpsLogResponseDTO } from 'dto/vehicleGpsLogs/VehicleGpsLogResponseDTO';
import { VehicleGpsLogService } from 'services/vehicleGpsLogs/VehicleGpsLogService';

export const list = async (req: Request, res: Response) => {
  const vehicleGpsLogService = new VehicleGpsLogService();
  const logs = await vehicleGpsLogService.findAll();

  return res.customSuccess(
    200,
    'Vehicle GPS logs fetched.',
    logs.map((log) => new VehicleGpsLogResponseDTO(log)),
  );
};
