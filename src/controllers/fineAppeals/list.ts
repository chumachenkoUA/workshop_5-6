import { Request, Response } from 'express';

import { FineAppealResponseDTO } from 'dto/fineAppeals/FineAppealResponseDTO';
import { FineAppealService } from 'services/fineAppeals/FineAppealService';

export const list = async (req: Request, res: Response) => {
  const fineAppealService = new FineAppealService();
  const appeals = await fineAppealService.findAll();

  return res.customSuccess(
    200,
    'Fine appeals fetched.',
    appeals.map((appeal) => new FineAppealResponseDTO(appeal)),
  );
};
