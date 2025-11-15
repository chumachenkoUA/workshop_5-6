import { Request, Response } from 'express';

import { FineService } from 'services/fines/FineService';

export const destroy = async (req: Request, res: Response) => {
  const fineService = new FineService();
  await fineService.delete(req.params.id);

  return res.customSuccess(200, 'Fine deleted.');
};
