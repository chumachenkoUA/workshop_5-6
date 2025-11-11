import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_STATUSES = ['В процесі', 'Оплачено', 'Відмінено', 'Просрочено'];

export const normalizeIdParam = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

export const normalizeStatus = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Status is required.');
  }

  const normalized = value.trim();
  if (!ALLOWED_STATUSES.includes(normalized)) {
    throw new CustomError(422, 'Validation', `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  return normalized;
};
