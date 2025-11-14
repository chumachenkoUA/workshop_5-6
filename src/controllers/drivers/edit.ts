import { Request, Response } from 'express';

import { DriverResponseDTO } from 'dto/drivers/DriverResponseDTO';
import { DriverService } from 'services/drivers/DriverService';

export const edit = async (req: Request, res: Response) => {
  const driverService = new DriverService();
  const driver = await driverService.update(req.params.id, {
    email: req.body.email,
    phone: req.body.phone,
    fullName: req.body.fullName,
    licenseData: req.body.licenseData,
    passportData: req.body.passportData,
  });

  return res.customSuccess(200, 'Driver updated.', new DriverResponseDTO(driver));
};
