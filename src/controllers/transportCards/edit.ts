import { Request, Response } from 'express';

import { TransportCardResponseDTO } from 'dto/transportCards/TransportCardResponseDTO';
import { TransportCardService } from 'services/transportCards/TransportCardService';

export const edit = async (req: Request, res: Response) => {
  const transportCardService = new TransportCardService();
  const card = await transportCardService.update(req.params.id, {
    userId: req.body.userId,
    number: req.body.number,
    balance: req.body.balance,
  });

  return res.customSuccess(200, 'Transport card updated.', new TransportCardResponseDTO(card));
};
