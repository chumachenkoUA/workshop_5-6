import { Request, Response } from 'express';

import { TransportTypeResponseDTO } from 'dto/transportTypes/TransportTypeResponseDTO';
import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

import { normalizeIdParam } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport type id');
  const transportTypeService = new TransportTypeService();
  const transportType = await transportTypeService.update(id, { name: req.body.name });

  return res.customSuccess(200, 'Transport type updated.', new TransportTypeResponseDTO(transportType));
};
