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

export const normalizeTimeField = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  // Basic HH:MM validation
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(value)) {
    throw new CustomError(422, 'Validation', `${fieldName} must be in HH:MM format.`);
  }

  return value;
};

export const normalizeIntervalMinutes = (value: unknown) => {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new CustomError(422, 'Validation', 'Interval minutes must be a positive number.');
  }
  return numberValue;
};
