import { Request, Response } from 'express';

import { TransitUserResponseDTO } from 'dto/transitUsers/TransitUserResponseDTO';
import { TransitUserService } from 'services/transitUsers/TransitUserService';

export const show = async (req: Request, res: Response) => {
  const transitUserService = new TransitUserService();
  const result = await transitUserService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Transit user fetched.', new TransitUserResponseDTO(result.user, result.lastGpsLog));
};
