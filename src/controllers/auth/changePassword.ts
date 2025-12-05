import { Request, Response } from 'express';

import { AuthService } from 'services/auth/AuthService';

export const changePassword = async (req: Request, res: Response) => {
  const authService = new AuthService();
  await authService.changePassword(req.jwtPayload.id, req.body.password, req.body.passwordNew);

  return res.customSuccess(200, 'Password successfully changed.');
};
