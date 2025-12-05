import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

const parseName = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Stop name is required.');
  }
  return value.trim();
};

const parseCoordinate = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  const normalized = value.toString();
  if (!Number.isFinite(Number(normalized))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid number.`);
  }
  return normalized;
};

export const validateStopPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.name = parseName(req.body.name);
    req.body.latitude = parseCoordinate(req.body.latitude, 'Latitude');
    req.body.longitude = parseCoordinate(req.body.longitude, 'Longitude');
    return next();
  } catch (err) {
    return next(err);
  }
};
