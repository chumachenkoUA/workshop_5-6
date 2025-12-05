import { Request, Response } from 'express';

import { FineAppealResponseDTO } from 'dto/fineAppeals/FineAppealResponseDTO';
import { FineAppealService } from 'services/fineAppeals/FineAppealService';

export const create = async (req: Request, res: Response) => {
  const fineAppealService = new FineAppealService();
  const appeal = await fineAppealService.create({
    fineId: req.body.fineId,
    message: req.body.message,
    status: req.body.status,
  });

  return res.customSuccess(201, 'Fine appeal created.', new FineAppealResponseDTO(appeal));
};
