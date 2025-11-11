import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeDriver } from './serializer';
import { driverRelations } from './shared';
import {
  normalizeEmail,
  normalizeFullName,
  normalizeIdParam,
  normalizeLicenseData,
  normalizePassportData,
  normalizePhone,
} from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Driver id');
  const email = normalizeEmail(req.body.email);
  const phone = normalizePhone(req.body.phone);
  const fullName = normalizeFullName(req.body.fullName);
  const licenseData = normalizeLicenseData(req.body.licenseData);
  const passportData = normalizePassportData(req.body.passportData);

  const driverRepository = getRepository(Driver);
  const driver = await driverRepository.findOne(id, { relations: driverRelations });

  if (!driver) {
    throw new CustomError(404, 'General', `Driver with id:${id} not found.`);
  }

  driver.email = email;
  driver.phone = phone;
  driver.fullName = fullName;
  driver.licenseData = licenseData;
  driver.passportData = passportData;

  await driverRepository.save(driver);

  return res.customSuccess(200, 'Driver updated.', serializeDriver(driver));
};
