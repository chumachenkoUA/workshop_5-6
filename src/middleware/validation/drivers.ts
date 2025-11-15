import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

const parseEmail = (value: unknown) => {
  if (typeof value !== 'string' || !validator.isEmail(value.trim())) {
    throw new CustomError(422, 'Validation', 'Valid email is required.');
  }
  return value.trim().toLowerCase();
};

const parseString = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }
  return value.trim();
};

const parsePassportData = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    throw new CustomError(422, 'Validation', 'Passport data must be an object.');
  }
  const input = value as Record<string, unknown>;
  const type = (input.type ?? input.documentType)?.toString();

  if (type === 'paper') {
    const series = input.series?.toString().trim();
    const number = input.number?.toString().trim();
    if (!series || !number) {
      throw new CustomError(422, 'Validation', 'Paper passport requires series and number.');
    }
    return { type: 'paper', series, number };
  }

  if (type === 'idCard') {
    const number = input.number?.toString().trim();
    if (!number) {
      throw new CustomError(422, 'Validation', 'ID card requires number.');
    }
    return { type: 'idCard', number };
  }

  throw new CustomError(422, 'Validation', 'Passport data must describe either paper or idCard document.');
};

const transform = (req: Request) => {
  req.body.email = parseEmail(req.body.email);
  req.body.phone = parseString(req.body.phone, 'Phone');
  req.body.fullName = parseString(req.body.fullName, 'Full name');
  req.body.licenseData = parseString(req.body.licenseData, 'License data');
  req.body.passportData = parsePassportData(req.body.passportData);
};

export const validateDriverPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    transform(req);
    return next();
  } catch (err) {
    return next(err);
  }
};
