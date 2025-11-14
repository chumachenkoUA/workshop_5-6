import { Request, Response } from 'express';

import { TransportTypeResponseDTO } from 'dto/transportTypes/TransportTypeResponseDTO';
import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport type id');

  const transportTypeService = new TransportTypeService();
  const transportType = await transportTypeService.findOneOrFail(id);

  return res.customSuccess(200, 'Transport type fetched.', new TransportTypeResponseDTO(transportType));
};
