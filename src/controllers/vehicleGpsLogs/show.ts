import { Request, Response } from 'express';

import { VehicleGpsLogResponseDTO } from 'dto/vehicleGpsLogs/VehicleGpsLogResponseDTO';
import { VehicleGpsLogService } from 'services/vehicleGpsLogs/VehicleGpsLogService';

export const show = async (req: Request, res: Response) => {
  const vehicleGpsLogService = new VehicleGpsLogService();
  const log = await vehicleGpsLogService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Vehicle GPS log fetched.', new VehicleGpsLogResponseDTO(log));
};
