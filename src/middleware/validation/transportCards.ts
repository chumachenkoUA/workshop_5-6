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

const parseNumberField = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Card number is required.');
  }
  return value.trim();
};

const parseBalance = (value: unknown) => {
  if (value === null || value === undefined) {
    return '0';
  }

  const normalized = value.toString();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new CustomError(422, 'Validation', 'Balance must be a non-negative number.');
  }

  return normalized;
};

export const validateTransportCardPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.userId = parseId(req.body.userId, 'User id');
    req.body.number = parseNumberField(req.body.number);
    req.body.balance = parseBalance(req.body.balance);
    return next();
  } catch (err) {
    return next(err);
  }
};
