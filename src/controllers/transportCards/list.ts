import { Request, Response } from 'express';

import { TransportCardResponseDTO } from 'dto/transportCards/TransportCardResponseDTO';
import { TransportCardService } from 'services/transportCards/TransportCardService';

export const list = async (req: Request, res: Response) => {
  const transportCardService = new TransportCardService();
  const cards = await transportCardService.findAll();

  return res.customSuccess(
    200,
    'Transport cards fetched.',
    cards.map((card) => new TransportCardResponseDTO(card)),
  );
};
