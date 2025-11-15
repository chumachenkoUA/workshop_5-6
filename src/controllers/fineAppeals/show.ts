import { Request, Response } from 'express';

import { FineAppealResponseDTO } from 'dto/fineAppeals/FineAppealResponseDTO';
import { FineAppealService } from 'services/fineAppeals/FineAppealService';

export const show = async (req: Request, res: Response) => {
  const fineAppealService = new FineAppealService();
  const appeal = await fineAppealService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Fine appeal fetched.', new FineAppealResponseDTO(appeal));
};
