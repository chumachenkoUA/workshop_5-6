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
export const normalizeStopId = (value: unknown) => normalizeIdParam(value, 'Stop id');

export const normalizeOptionalRouteStopId = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return normalizeIdParam(value, fieldName);
};
