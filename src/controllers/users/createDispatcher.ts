import { Request, Response } from 'express';

import { UserResponseDTO } from 'dto/users/UserResponseDTO';
import { UserService } from 'services/users/UserService';

export const createDispatcher = async (req: Request, res: Response) => {
  const userService = new UserService();
  const dispatcher = await userService.createDispatcher({
    email: req.body.email,
    phone: req.body.phone,
    fullName: req.body.fullName,
    password: req.body.password,
  });

  return res.customSuccess(201, 'Dispatcher created.', new UserResponseDTO(dispatcher));
};
