import { Request, Response } from 'express';

import { TransportCardResponseDTO } from 'dto/transportCards/TransportCardResponseDTO';
import { TransportCardService } from 'services/transportCards/TransportCardService';

export const getMine = async (req: Request, res: Response) => {
  const transportCardService = new TransportCardService();
  const card = await transportCardService.findMine(req.jwtPayload.id);

  return res.customSuccess(200, 'Transport card fetched.', new TransportCardResponseDTO(card));
};
