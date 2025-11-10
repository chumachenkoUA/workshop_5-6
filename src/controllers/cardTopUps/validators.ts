import { CustomError } from 'utils/response/custom-error/CustomError';

export const normalizeAmountInput = (amount: unknown): string => {
  if (amount === null || amount === undefined) {
    throw new CustomError(422, 'Validation', 'Amount is required.');
  }

  const normalized = amount.toString();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new CustomError(422, 'Validation', 'Amount must be a positive number.');
  }

  return normalized;
};

export const normalizeIdParam = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};
