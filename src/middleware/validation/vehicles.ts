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

const parseBoardNumber = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Board number is required.');
  }
  return value.trim();
};

const parseCapacity = (value: unknown) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new CustomError(422, 'Validation', 'Capacity must be a positive number.');
  }
  return numberValue;
};

export const validateVehiclePayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.boardNumber = parseBoardNumber(req.body.boardNumber);
    req.body.capacity = parseCapacity(req.body.capacity);
    req.body.transportTypeId = parseId(req.body.transportTypeId, 'Transport type id');
    req.body.routeId = parseId(req.body.routeId, 'Route id');
    return next();
  } catch (err) {
    return next(err);
  }
};
