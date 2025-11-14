import { Request, Response } from 'express';

import { CardTopUpResponseDTO } from 'dto/cardTopUps/CardTopUpResponseDTO';
import { CardTopUpService } from 'services/cardTopUps/CardTopUpService';

export const create = async (req: Request, res: Response) => {
  const cardTopUpService = new CardTopUpService();
  const topUp = await cardTopUpService.create({
    cardId: req.body.cardId,
    amount: req.body.amount,
  });

  return res.customSuccess(201, 'Card top-up created.', new CardTopUpResponseDTO(topUp));
};
