import { Request, Response } from 'express';

import { TransportCardResponseDTO } from 'dto/transportCards/TransportCardResponseDTO';
import { TransportCardService } from 'services/transportCards/TransportCardService';

export const show = async (req: Request, res: Response) => {
  const transportCardService = new TransportCardService();
  const card = await transportCardService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Transport card fetched.', new TransportCardResponseDTO(card));
};
