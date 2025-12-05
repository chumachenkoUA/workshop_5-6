import { Request, Response } from 'express';

import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

export const destroy = async (req: Request, res: Response) => {
  const transportTypeService = new TransportTypeService();
  await transportTypeService.delete(req.params.id);

  return res.customSuccess(200, 'Transport type deleted.');
};
