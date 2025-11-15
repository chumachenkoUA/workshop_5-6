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
  const date = new Date(value as string);
  if (!value || Number.isNaN(date.getTime())) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid date.`);
  }
  return date;
};

const parsePassengerCount = (value: unknown) => {
  const numberValue = Number(value ?? 0);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new CustomError(422, 'Validation', 'Passenger count must be a non-negative number.');
  }
  return numberValue;
};

export const validateTripPayload = (req: Request, res: Response, next: NextFunction) => {
  req.body.routeId = parseId(req.body.routeId, 'Route id');
  req.body.vehicleId = parseId(req.body.vehicleId, 'Vehicle id');
  req.body.driverId = parseId(req.body.driverId, 'Driver id');
  req.body.startedAt = parseDate(req.body.startedAt, 'Started at');
  req.body.endedAt = parseDate(req.body.endedAt, 'Ended at');
  if (req.body.endedAt <= req.body.startedAt) {
    throw new CustomError(422, 'Validation', 'Ended at must be greater than started at.');
  }
  req.body.passengerCount = parsePassengerCount(req.body.passengerCount);
  return next();
};
