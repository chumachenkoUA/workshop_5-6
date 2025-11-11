import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_DIRECTIONS = ['прямий', 'зворотній'];

export const normalizeIdParam = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

export const normalizeTransportTypeId = (value: unknown) => normalizeIdParam(value, 'Transport type id');

export const normalizeNumberField = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Route number is required.');
  }
  return value.trim();
};

export const normalizeDirection = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Direction is required.');
  }

  const normalized = value.trim();
  if (!ALLOWED_DIRECTIONS.includes(normalized)) {
    throw new CustomError(422, 'Validation', `Direction must be one of: ${ALLOWED_DIRECTIONS.join(', ')}`);
  }

  return normalized;
};

export const normalizeActive = (value: unknown) => {
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
