import { Request, Response } from 'express';

import { VehicleGpsLogService } from 'services/vehicleGpsLogs/VehicleGpsLogService';

export const destroy = async (req: Request, res: Response) => {
  const vehicleGpsLogService = new VehicleGpsLogService();
  await vehicleGpsLogService.delete(req.params.id);

  return res.customSuccess(200, 'Vehicle GPS log deleted.');
};
