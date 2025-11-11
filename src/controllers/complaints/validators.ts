import { CustomError } from 'utils/response/custom-error/CustomError';

const ALLOWED_STATUSES = ['Подано', 'Розглядається', 'Розглянуто'];

export const normalizeIdParam = (value: unknown, fieldName: string) => {
  if (!value) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  if (Number.isNaN(Number(value))) {
    throw new CustomError(422, 'Validation', `${fieldName} must be a valid identifier.`);
  }

  return value.toString();
};

export const normalizeTextField = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', `${fieldName} is required.`);
  }

  return value.trim();
};

export const normalizeStatus = (value: unknown) => {
  const status = normalizeTextField(value, 'Status');

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new CustomError(422, 'Validation', `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`);
  }

  return status;
};
