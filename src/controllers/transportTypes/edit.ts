import { Request, Response } from 'express';

import { TransportTypeResponseDTO } from 'dto/transportTypes/TransportTypeResponseDTO';
import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

export const edit = async (req: Request, res: Response) => {
  const transportTypeService = new TransportTypeService();
  const transportType = await transportTypeService.update(req.params.id, { name: req.body.name });

  return res.customSuccess(200, 'Transport type updated.', new TransportTypeResponseDTO(transportType));
};
