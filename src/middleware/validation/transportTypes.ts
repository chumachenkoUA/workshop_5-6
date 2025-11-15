import { Request, Response, NextFunction } from 'express';

import { CustomError } from 'utils/response/custom-error/CustomError';

export const validateTransportTypePayload = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return next(new CustomError(400, 'Validation', 'Transport type name is required.'));
  }

  req.body.name = name.trim();

  return next();
};
