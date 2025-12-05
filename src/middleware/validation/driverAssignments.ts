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

const parseDate = (value: unknown, fieldName: string) => {
  if (!value) {
    return null;
  }
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid date.`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid date.`);
  }
  return date;
};

const transform = (req: Request) => {
  req.body.driverId = parseId(req.body.driverId, 'Driver id');
  req.body.vehicleId = parseId(req.body.vehicleId, 'Vehicle id');
  const assignedAt = parseDate(req.body.assignedAt, 'Assigned at');
  if (assignedAt) {
    req.body.assignedAt = assignedAt;
  } else {
    delete req.body.assignedAt;
  }
};

export const validateDriverAssignmentCreate = (req: Request, res: Response, next: NextFunction) => {
  try {
    transform(req);
    return next();
  } catch (err) {
    return next(err);
  }
};

export const validateDriverAssignmentUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    transform(req);
    return next();
  } catch (err) {
    return next(err);
  }
};
