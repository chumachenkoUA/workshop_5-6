import { Request, Response } from 'express';

import { AuthService } from 'services/auth/AuthService';

export const register = async (req: Request, res: Response) => {
  const authService = new AuthService();
  await authService.register({
    email: req.body.email,
    phone: req.body.phone,
    fullName: req.body.fullName,
    password: req.body.password,
  });

  // Response body intentionally keeps data null to preserve public surface and existing tests.
  return res.customSuccess(200, 'User successfully created.');
};
