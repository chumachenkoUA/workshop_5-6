import { Request, Response } from 'express';

import { UserResponseDTO } from 'dto/users/UserResponseDTO';
import { UserService } from 'services/users/UserService';

export const edit = async (req: Request, res: Response) => {
  const userService = new UserService();
  const updated = await userService.update(req.params.id, { name: req.body.name });

  return res.customSuccess(200, 'User successfully saved.', new UserResponseDTO(updated));
};
