import { Request, Response } from 'express';

import { TransportTypeResponseDTO } from 'dto/transportTypes/TransportTypeResponseDTO';
import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

export const create = async (req: Request, res: Response) => {
  const transportTypeService = new TransportTypeService();
  const transportType = await transportTypeService.create({ name: req.body.name });

  return res.customSuccess(201, 'Transport type created.', new TransportTypeResponseDTO(transportType));
};
