import { Request, Response } from 'express';

import { TransitUserService } from 'services/transitUsers/TransitUserService';

export const destroy = async (req: Request, res: Response) => {
  const transitUserService = new TransitUserService();
  await transitUserService.delete(req.params.id);

  return res.customSuccess(200, 'Transit user deleted.');
};
