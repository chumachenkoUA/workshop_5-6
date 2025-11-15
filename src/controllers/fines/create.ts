import { Request, Response } from 'express';

import { FineResponseDTO } from 'dto/fines/FineResponseDTO';
import { FineService } from 'services/fines/FineService';

export const create = async (req: Request, res: Response) => {
  const fineService = new FineService();
  const fine = await fineService.create({
    userId: req.body.userId,
    tripId: req.body.tripId,
    status: req.body.status,
  });

  return res.customSuccess(201, 'Fine created.', new FineResponseDTO(fine));
};
