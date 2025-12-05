import { Request, Response } from 'express';

import { UserResponseDTO } from 'dto/users/UserResponseDTO';
import { UserService } from 'services/users/UserService';

export const list = async (_req: Request, res: Response) => {
  const userService = new UserService();
  const users = await userService.findAll();

  return res.customSuccess(
    200,
    'List of users.',
    users.map((user) => new UserResponseDTO(user)),
  );
};
