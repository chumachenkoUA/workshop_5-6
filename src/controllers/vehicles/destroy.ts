import { Request, Response } from 'express';

import { VehicleService } from 'services/vehicles/VehicleService';

export const destroy = async (req: Request, res: Response) => {
  const vehicleService = new VehicleService();
  await vehicleService.delete(req.params.id);

  return res.customSuccess(200, 'Vehicle deleted.');
};
