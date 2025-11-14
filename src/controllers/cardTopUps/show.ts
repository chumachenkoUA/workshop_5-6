import { Request, Response } from 'express';

import { CardTopUpResponseDTO } from 'dto/cardTopUps/CardTopUpResponseDTO';
import { CardTopUpService } from 'services/cardTopUps/CardTopUpService';

export const show = async (req: Request, res: Response) => {
  const cardTopUpService = new CardTopUpService();
  const topUp = await cardTopUpService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Card top-up fetched.', new CardTopUpResponseDTO(topUp));
};
