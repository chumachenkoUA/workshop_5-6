import { Request, Response } from 'express';

import { TransitUserResponseDTO } from 'dto/transitUsers/TransitUserResponseDTO';
import { TransitUserService } from 'services/transitUsers/TransitUserService';

export const create = async (req: Request, res: Response) => {
  const transitUserService = new TransitUserService();
  const result = await transitUserService.create({
    email: req.body.email,
    phone: req.body.phone,
    fullName: req.body.fullName,
  });

  return res.customSuccess(201, 'Transit user created.', new TransitUserResponseDTO(result.user, result.lastGpsLog));
};
