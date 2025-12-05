import { Request, Response } from 'express';

import { FineResponseDTO } from 'dto/fines/FineResponseDTO';
import { FineService } from 'services/fines/FineService';

export const show = async (req: Request, res: Response) => {
  const fineService = new FineService();
  const fine = await fineService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Fine fetched.', new FineResponseDTO(fine));
};
