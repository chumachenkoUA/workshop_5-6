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

const parseOptionalId = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return parseId(value, fieldName);
};

export const validateRouteStopPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.routeId = parseId(req.body.routeId, 'Route id');
    req.body.stopId = parseId(req.body.stopId, 'Stop id');
    req.body.previousRouteStopId = parseOptionalId(req.body.previousRouteStopId, 'Previous route stop id');
    req.body.nextRouteStopId = parseOptionalId(req.body.nextRouteStopId, 'Next route stop id');
    return next();
  } catch (err) {
    return next(err);
  }
};
