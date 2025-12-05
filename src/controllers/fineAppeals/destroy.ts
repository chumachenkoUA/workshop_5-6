import { Request, Response } from 'express';

import { FineAppealService } from 'services/fineAppeals/FineAppealService';

export const destroy = async (req: Request, res: Response) => {
  const fineAppealService = new FineAppealService();
  await fineAppealService.delete(req.params.id);

  return res.customSuccess(200, 'Fine appeal deleted.');
};
