import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../utils/response/custom-error/CustomError';

export const errorHandler = (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof CustomError) {
    return res.status(err.HttpStatusCode).json(err.JSON);
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
