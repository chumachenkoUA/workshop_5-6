import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_STATUSES = ['Подано', 'Перевіряється', 'Відхилено', 'Прийнято'];

const parseId = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

const parseText = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }
  return value.trim();
};

const parseStatus = (value: unknown) => {
  const status = parseText(value, 'Status');
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new CustomError(422, 'Validation', `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }
  return status;
};

export const validateFineAppealPayload = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body.fineId = parseId(req.body.fineId, 'Fine id');
    req.body.message = parseText(req.body.message, 'Message');
    req.body.status = parseStatus(req.body.status);
    return next();
  } catch (err) {
    return next(err);
  }
};
