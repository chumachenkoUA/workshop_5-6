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

export const normalizeTripId = (value: unknown) => normalizeIdParam(value, 'Trip id');
export const normalizeCardId = (value: unknown) => normalizeIdParam(value, 'Card id');

export const normalizePrice = (value: unknown) => {
  if (value === null || value === undefined) {
    throw new CustomError(422, 'Validation', 'Price is required.');
  }

  const normalized = value.toString();
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new CustomError(422, 'Validation', 'Price must be a non-negative number.');
  }

  return normalized;
};
