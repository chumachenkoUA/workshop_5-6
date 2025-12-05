import { Request, Response } from 'express';

import { UserResponseDTO } from 'dto/users/UserResponseDTO';
import { UserService } from 'services/users/UserService';

export const destroy = async (req: Request, res: Response) => {
  const userService = new UserService();
  const deleted = await userService.delete(req.params.id);

  return res.customSuccess(200, 'User successfully deleted.', new UserResponseDTO(deleted));
};
