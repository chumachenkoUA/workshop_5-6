import { Request, Response } from 'express';

import { FineResponseDTO } from 'dto/fines/FineResponseDTO';
import { FineService } from 'services/fines/FineService';

export const list = async (req: Request, res: Response) => {
  const fineService = new FineService();
  const fines = await fineService.findAll();

  return res.customSuccess(
    200,
    'Fines fetched.',
    fines.map((fine) => new FineResponseDTO(fine)),
  );
};
