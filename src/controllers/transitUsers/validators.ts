import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const normalizeIdParam = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

export const normalizeEmail = (value: unknown) => {
  if (typeof value !== 'string' || !validator.isEmail(value)) {
    throw new CustomError(422, 'Validation', 'Valid email is required.');
  }
  return value.trim().toLowerCase();
};

export const normalizePhone = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Phone is required.');
  }
  return value.trim();
};

export const normalizeFullName = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Full name is required.');
  }
  return value.trim();
};
