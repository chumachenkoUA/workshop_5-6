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

export const normalizeRouteId = (value: unknown) => normalizeIdParam(value, 'Route id');

export const normalizeCoordinate = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  const normalized = value.toString();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a number.`);
  }

  return normalized;
};

export const normalizeOptionalPointId = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return normalizeIdParam(value, fieldName);
};
