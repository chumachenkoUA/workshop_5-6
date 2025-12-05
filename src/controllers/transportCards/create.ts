import { Request, Response } from 'express';

import { TransportCardResponseDTO } from 'dto/transportCards/TransportCardResponseDTO';
import { TransportCardService } from 'services/transportCards/TransportCardService';

export const create = async (req: Request, res: Response) => {
  const transportCardService = new TransportCardService();
  const card = await transportCardService.create({
    userId: req.body.userId,
    number: req.body.number,
    balance: req.body.balance,
  });

  return res.customSuccess(201, 'Transport card created.', new TransportCardResponseDTO(card));
};
