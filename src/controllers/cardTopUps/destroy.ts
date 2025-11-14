import { Request, Response } from 'express';

import { CardTopUpService } from 'services/cardTopUps/CardTopUpService';

export const destroy = async (req: Request, res: Response) => {
  const cardTopUpService = new CardTopUpService();
  await cardTopUpService.delete(req.params.id);

  return res.customSuccess(200, 'Card top-up deleted.');
};
