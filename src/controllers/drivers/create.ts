import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeDriver } from './serializer';
import { driverRelations } from './shared';
import {
  normalizeEmail,
  normalizeFullName,
  normalizeLicenseData,
  normalizePassportData,
  normalizePhone,
} from './validators';

export const create = async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body.email);
  const phone = normalizePhone(req.body.phone);
  const fullName = normalizeFullName(req.body.fullName);
  const licenseData = normalizeLicenseData(req.body.licenseData);
  const passportData = normalizePassportData(req.body.passportData);

  const driverRepository = getRepository(Driver);
  const driver = driverRepository.create({
    email,
    phone,
    fullName,
    licenseData,
    passportData,
  });

  await driverRepository.save(driver);

  const createdDriver = await driverRepository.findOne(driver.id, { relations: driverRelations });

  if (!createdDriver) {
    throw new CustomError(500, 'General', 'Driver could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Driver created.', serializeDriver(createdDriver));
};
