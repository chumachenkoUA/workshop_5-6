import { Request, Response } from 'express';

import { DriverResponseDTO } from 'dto/drivers/DriverResponseDTO';
import { DriverService } from 'services/drivers/DriverService';

export const show = async (req: Request, res: Response) => {
  const driverService = new DriverService();
  const driver = await driverService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Driver fetched.', new DriverResponseDTO(driver));
};
