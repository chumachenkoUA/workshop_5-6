import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { ConstsUser } from 'consts/ConstsUser';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
  let { email, password, passwordConfirm, fullName, phone } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  email = !email ? '' : String(email);
  password = !password ? '' : String(password);
  passwordConfirm = !passwordConfirm ? '' : String(passwordConfirm);
  fullName = !fullName ? '' : String(fullName);
  phone = !phone ? '' : String(phone);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedFullName = fullName.trim();
  const normalizedPhone = phone.trim();

  if (!validator.isEmail(normalizedEmail)) {
    errorsValidation.push({ email: 'Email is invalid' });
  }

  if (validator.isEmpty(normalizedEmail)) {
    errorsValidation.push({ email: 'Email is required' });
  }

  if (validator.isEmpty(password)) {
    errorsValidation.push({ password: 'Password is required' });
  }

  if (!validator.isLength(password, { min: ConstsUser.PASSWORD_MIN_CHAR })) {
    errorsValidation.push({
      password: `Password must be at least ${ConstsUser.PASSWORD_MIN_CHAR} characters`,
    });
  }

  if (validator.isEmpty(passwordConfirm)) {
    errorsValidation.push({ passwordConfirm: 'Confirm password is required' });
  }

  if (!validator.equals(password, passwordConfirm)) {
    errorsValidation.push({ passwordConfirm: 'Passwords must match' });
  }

  if (validator.isEmpty(normalizedFullName)) {
    errorsValidation.push({ fullName: 'Full name is required' });
  }

  if (validator.isEmpty(normalizedPhone)) {
    errorsValidation.push({ phone: 'Phone is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Register validation error', null, null, errorsValidation);
    return next(customError);
  }
  req.body.email = normalizedEmail;
  req.body.fullName = normalizedFullName;
  req.body.phone = normalizedPhone;
  return next();
};
