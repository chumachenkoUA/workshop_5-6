import { Request, Response } from 'express';

import { AuthService } from 'services/auth/AuthService';

export const login = async (req: Request, res: Response) => {
  const authService = new AuthService();
  const token = await authService.login(req.body.email, req.body.password);

  return res.customSuccess(200, 'Token successfully created.', token);
};
