import { Request, Response } from 'express';

import { FineResponseDTO } from 'dto/fines/FineResponseDTO';
import { FineService } from 'services/fines/FineService';

export const edit = async (req: Request, res: Response) => {
  const fineService = new FineService();
  const fine = await fineService.update(req.params.id, {
    userId: req.body.userId,
    tripId: req.body.tripId,
    status: req.body.status,
  });

  return res.customSuccess(200, 'Fine updated.', new FineResponseDTO(fine));
};
