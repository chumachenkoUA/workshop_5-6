import { Request, Response } from 'express';

import { TransitUserResponseDTO } from 'dto/transitUsers/TransitUserResponseDTO';
import { TransitUserService } from 'services/transitUsers/TransitUserService';

export const edit = async (req: Request, res: Response) => {
  const transitUserService = new TransitUserService();
  const result = await transitUserService.update(req.params.id, {
    email: req.body.email,
    phone: req.body.phone,
    fullName: req.body.fullName,
  });

  return res.customSuccess(200, 'Transit user updated.', new TransitUserResponseDTO(result.user, result.lastGpsLog));
};
