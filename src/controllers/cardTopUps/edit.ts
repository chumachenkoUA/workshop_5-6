import { Request, Response } from 'express';

import { CardTopUpResponseDTO } from 'dto/cardTopUps/CardTopUpResponseDTO';
import { CardTopUpService } from 'services/cardTopUps/CardTopUpService';

export const edit = async (req: Request, res: Response) => {
  const cardTopUpService = new CardTopUpService();
  const topUp = await cardTopUpService.update(req.params.id, { amount: req.body.amount });

  return res.customSuccess(200, 'Card top-up updated.', new CardTopUpResponseDTO(topUp));
};
