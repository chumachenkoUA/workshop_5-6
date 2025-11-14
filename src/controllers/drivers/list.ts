import { Request, Response } from 'express';

import { DriverResponseDTO } from 'dto/drivers/DriverResponseDTO';
import { DriverService } from 'services/drivers/DriverService';

export const list = async (req: Request, res: Response) => {
  const driverService = new DriverService();
  const drivers = await driverService.findAll();

  return res.customSuccess(
    200,
    'Drivers fetched.',
    drivers.map((driver) => new DriverResponseDTO(driver)),
  );
};
