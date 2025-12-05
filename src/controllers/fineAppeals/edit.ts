import { Request, Response } from 'express';

import { FineAppealResponseDTO } from 'dto/fineAppeals/FineAppealResponseDTO';
import { FineAppealService } from 'services/fineAppeals/FineAppealService';

export const edit = async (req: Request, res: Response) => {
  const fineAppealService = new FineAppealService();
  const appeal = await fineAppealService.update(req.params.id, {
    fineId: req.body.fineId,
    message: req.body.message,
    status: req.body.status,
  });

  return res.customSuccess(200, 'Fine appeal updated.', new FineAppealResponseDTO(appeal));
};
