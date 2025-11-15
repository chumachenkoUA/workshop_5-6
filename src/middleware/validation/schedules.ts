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

const parseTimeField = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(value)) {
    throw new CustomError(422, 'Validation', `${fieldName} must be in HH:MM format.`);
  }

  return value;
};

const parseInterval = (value: unknown) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new CustomError(422, 'Validation', 'Interval minutes must be a positive number.');
  }

  return numberValue;
};

export const validateSchedulePayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.routeId = parseId(req.body.routeId, 'Route id');
    req.body.workdayStart = parseTimeField(req.body.workdayStart, 'Workday start');
    req.body.workdayEnd = parseTimeField(req.body.workdayEnd, 'Workday end');
    req.body.intervalMinutes = parseInterval(req.body.intervalMinutes);
    return next();
  } catch (err) {
    return next(err);
  }
};
