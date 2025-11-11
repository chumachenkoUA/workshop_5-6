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

export const normalizeUserId = (value: unknown) => normalizeIdParam(value, 'User id');

export const normalizeNumberField = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Card number is required.');
  }
  return value.trim();
};

export const normalizeBalance = (value: unknown) => {
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
