import { Request, Response, NextFunction } from 'express';
import validator from 'validator';

import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

export const validatorEdit = (req: Request, res: Response, next: NextFunction) => {
  const { name = '' } = req.body;
  const errorsValidation: ErrorValidation[] = [];

  if (validator.isEmpty(String(name).trim())) {
    errorsValidation.push({ name: 'Name is required' });
  }

  if (errorsValidation.length !== 0) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, errorsValidation);
    return next(customError);
  }

  req.body.name = String(name).trim();
  return next();
};
