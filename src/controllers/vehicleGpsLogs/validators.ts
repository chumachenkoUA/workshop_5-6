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

export const normalizeVehicleId = (value: unknown) => normalizeIdParam(value, 'Vehicle id');

const normalizeCoordinate = (value: unknown, fieldName: string) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  const normalized = value.toString();
  if (!Number.isFinite(Number(normalized))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a number.`);
  }

  return normalized;
};

export const normalizeLatitude = (value: unknown) => normalizeCoordinate(value, 'Latitude');
export const normalizeLongitude = (value: unknown) => normalizeCoordinate(value, 'Longitude');
