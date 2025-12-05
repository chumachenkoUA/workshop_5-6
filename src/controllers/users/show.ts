import { Request, Response } from 'express';

import { UserResponseDTO } from 'dto/users/UserResponseDTO';
import { UserService } from 'services/users/UserService';

export const show = async (req: Request, res: Response) => {
  const userService = new UserService();
  const user = await userService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'User found', new UserResponseDTO(user));
};
