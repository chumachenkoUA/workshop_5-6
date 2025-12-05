import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

const parseEmail = (value: unknown) => {
  if (typeof value !== 'string' || !validator.isEmail(value)) {
    throw new CustomError(422, 'Validation', 'Valid email is required.');
  }
  return value.trim().toLowerCase();
};

const parsePhone = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Phone is required.');
  }
  return value.trim();
};

const parseFullName = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Full name is required.');
  }
  return value.trim();
};

export const validateTransitUserPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.email = parseEmail(req.body.email);
    req.body.phone = parsePhone(req.body.phone);
    req.body.fullName = parseFullName(req.body.fullName);
    return next();
  } catch (err) {
    return next(err);
  }
};
