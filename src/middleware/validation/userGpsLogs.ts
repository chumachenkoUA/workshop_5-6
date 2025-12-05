import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

const parseId = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

const parseCoordinate = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  const normalized = value.toString();
  if (!Number.isFinite(Number(normalized))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a number.`);
  }

  return normalized;
};

export const validateUserGpsLogPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.userId = parseId(req.body.userId, 'User id');
    req.body.latitude = parseCoordinate(req.body.latitude, 'Latitude');
    req.body.longitude = parseCoordinate(req.body.longitude, 'Longitude');
    return next();
  } catch (err) {
    return next(err);
  }
};
