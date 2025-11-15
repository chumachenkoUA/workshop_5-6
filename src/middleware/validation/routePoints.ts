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

const parseRouteId = (value: unknown) => parseId(value, 'Route id');

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

const parseOptionalPointId = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return parseId(value, fieldName);
};

export const validateRoutePointPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.routeId = parseRouteId(req.body.routeId);
    req.body.latitude = parseCoordinate(req.body.latitude, 'Latitude');
    req.body.longitude = parseCoordinate(req.body.longitude, 'Longitude');
    req.body.previousPointId = parseOptionalPointId(req.body.previousPointId, 'Previous point id');
    req.body.nextPointId = parseOptionalPointId(req.body.nextPointId, 'Next point id');
    return next();
  } catch (err) {
    return next(err);
  }
};
