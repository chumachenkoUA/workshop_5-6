import { Request, Response } from 'express';

import { TransportCardService } from 'services/transportCards/TransportCardService';

export const destroy = async (req: Request, res: Response) => {
  const transportCardService = new TransportCardService();
  await transportCardService.delete(req.params.id);

  return res.customSuccess(200, 'Transport card deleted.');
};
