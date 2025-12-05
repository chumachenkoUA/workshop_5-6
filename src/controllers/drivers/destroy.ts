import { Request, Response } from 'express';

import { DriverService } from 'services/drivers/DriverService';

export const destroy = async (req: Request, res: Response) => {
  const driverService = new DriverService();
  await driverService.delete(req.params.id);

  return res.customSuccess(200, 'Driver deleted.');
};
