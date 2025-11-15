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

const parseAmount = (value: unknown) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', 'Amount is required.');
  }

  const normalized = value.toString();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new CustomError(422, 'Validation', 'Amount must be a positive number.');
  }

  return normalized;
};

export const validateCardTopUpCreate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.cardId = parseId(req.body.cardId, 'Card id');
    req.body.amount = parseAmount(req.body.amount);
    return next();
  } catch (err) {
    return next(err);
  }
};

export const validateCardTopUpUpdate = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.amount = parseAmount(req.body.amount);
    return next();
  } catch (err) {
    return next(err);
  }
};
