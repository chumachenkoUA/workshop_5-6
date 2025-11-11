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
export const normalizeVehicleId = (value: unknown) => normalizeIdParam(value, 'Vehicle id');
export const normalizeDriverId = (value: unknown) => normalizeIdParam(value, 'Driver id');

export const normalizeDate = (value: unknown, fieldName: string) => {
  const date = new Date(value as string);
  if (!value || Number.isNaN(date.getTime())) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid date.`);
  }
  return date;
};

export const normalizePassengerCount = (value: unknown) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) {
    throw new CustomError(422, 'Validation', 'Passenger count must be a non-negative number.');
  }
  return numberValue;
};
