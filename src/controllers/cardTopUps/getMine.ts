import { Request, Response } from 'express';

import { CardTopUpResponseDTO } from 'dto/cardTopUps/CardTopUpResponseDTO';
import { CardTopUpService } from 'services/cardTopUps/CardTopUpService';

export const getMine = async (req: Request, res: Response) => {
  const cardTopUpService = new CardTopUpService();
  const topUps = await cardTopUpService.findMine(req.jwtPayload.id);

  return res.customSuccess(
    200,
    'Card top-ups fetched.',
    topUps.map((topUp) => new CardTopUpResponseDTO(topUp)),
  );
};
