import { Request, Response } from 'express';

import { CardTopUpResponseDTO } from 'dto/cardTopUps/CardTopUpResponseDTO';
import { CardTopUpService } from 'services/cardTopUps/CardTopUpService';

export const list = async (req: Request, res: Response) => {
  const cardTopUpService = new CardTopUpService();
  const topUps = await cardTopUpService.findAll();

  return res.customSuccess(
    200,
    'Card top-ups fetched.',
    topUps.map((topUp) => new CardTopUpResponseDTO(topUp)),
  );
};
