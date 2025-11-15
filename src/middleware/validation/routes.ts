import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_DIRECTIONS = ['прямий', 'зворотній'];

const parseId = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

const parseTransportTypeId = (value: unknown) => parseId(value, 'Transport type id');

const parseNumber = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Route number is required.');
  }
  return value.trim();
};

const parseDirection = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Direction is required.');
  }

  const normalized = value.trim();
  if (!ALLOWED_DIRECTIONS.includes(normalized)) {
    throw new CustomError(422, 'Validation', `Direction must be one of: ${ALLOWED_DIRECTIONS.join(', ')}`);
  }

  return normalized;
};

const parseActive = (value: unknown) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  throw new CustomError(422, 'Validation', 'Active must be a boolean value.');
};

export const validateRoutePayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.transportTypeId = parseTransportTypeId(req.body.transportTypeId);
    req.body.number = parseNumber(req.body.number);
    req.body.direction = parseDirection(req.body.direction);
    req.body.active = parseActive(req.body.active);
    return next();
  } catch (err) {
    return next(err);
  }
};
