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

const parsePrice = (value: unknown) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', 'Price is required.');
  }

  const normalized = value.toString();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new CustomError(422, 'Validation', 'Price must be a non-negative number.');
  }

  return normalized;
};

export const validateTicketPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.tripId = parseId(req.body.tripId, 'Trip id');
    req.body.cardId = parseId(req.body.cardId, 'Card id');
    req.body.price = parsePrice(req.body.price);
    return next();
  } catch (err) {
    return next(err);
  }
};
