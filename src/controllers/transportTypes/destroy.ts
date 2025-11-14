import { Request, Response } from 'express';

import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transport type id');

  const transportTypeService = new TransportTypeService();
  await transportTypeService.delete(id);

  return res.customSuccess(200, 'Transport type deleted.');
};
