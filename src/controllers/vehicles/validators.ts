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

export const normalizeBoardNumber = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Board number is required.');
  }
  return value.trim();
};

export const normalizeCapacity = (value: unknown) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new CustomError(422, 'Validation', 'Capacity must be a positive number.');
  }
  return numberValue;
};

export const normalizeTransportTypeId = (value: unknown) => normalizeIdParam(value, 'Transport type id');
export const normalizeRouteId = (value: unknown) => normalizeIdParam(value, 'Route id');
