import { Request, Response } from 'express';

import { TransportTypeResponseDTO } from 'dto/transportTypes/TransportTypeResponseDTO';
import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

export const show = async (req: Request, res: Response) => {
  const transportTypeService = new TransportTypeService();
  const transportType = await transportTypeService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Transport type fetched.', new TransportTypeResponseDTO(transportType));
};
