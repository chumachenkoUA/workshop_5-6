import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Role } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, fullName, phone } = req.body;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: [{ email }, { phone }] });

    if (user) {
      const conflicts = [];
      if (user.email === email) {
        conflicts.push(`Email '${user.email}' already exists`);
      }
      if (phone && user.phone === phone) {
        conflicts.push(`Phone '${user.phone}' already exists`);
      }
      const customError = new CustomError(400, 'General', 'User already exists', [...conflicts]);
      return next(customError);
    }

    try {
      const newUser = new User();
      newUser.email = email;
      newUser.phone = phone;
      newUser.fullName = fullName;
      newUser.name = fullName;
      newUser.password = password;
      newUser.role = 'TRANSIT' as Role;
      newUser.registeredAt = new Date();
      newUser.hashPassword();
      await userRepository.save(newUser);

      res.customSuccess(200, 'User successfully created.');
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `User '${email}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
