import validator from 'validator';

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

export const normalizeEmail = (value: unknown) => {
  if (typeof value !== 'string' || !validator.isEmail(value)) {
    throw new CustomError(422, 'Validation', 'Valid email is required.');
  }
  return value.trim();
};

export const normalizePhone = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Phone is required.');
  }
  return value.trim();
};

export const normalizeFullName = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'Full name is required.');
  }
  return value.trim();
};

export const normalizeLicenseData = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new CustomError(422, 'Validation', 'License data is required.');
  }
  return value.trim();
};

type PassportPaperInput = { type?: string; series?: string; number?: string };
type PassportIdCardInput = { documentType?: string; number?: string };

export const normalizePassportData = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    throw new CustomError(422, 'Validation', 'Passport data must be an object.');
  }

  const input = value as PassportPaperInput & PassportIdCardInput;
  const docType = (input.type ?? input.documentType)?.toString();

  if (docType === 'paper') {
    if (!input.series || !input.number) {
      throw new CustomError(422, 'Validation', 'Paper passport requires series and number.');
    }
    return {
      type: 'paper',
      series: input.series.toString().trim(),
      number: input.number.toString().trim(),
    };
  }

  if (docType === 'idCard') {
    if (!input.number) {
      throw new CustomError(422, 'Validation', 'ID card requires number.');
    }
    return {
      type: 'idCard',
      number: input.number.toString().trim(),
    };
  }

  throw new CustomError(422, 'Validation', 'Passport data must describe either paper or idCard document.');
};
