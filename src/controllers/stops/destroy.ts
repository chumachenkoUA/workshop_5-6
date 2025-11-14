import { Request, Response } from 'express';

import { StopService } from 'services/stops/StopService';

export const destroy = async (req: Request, res: Response) => {
  const stopService = new StopService();
  await stopService.delete(req.params.id);

  return res.customSuccess(200, 'Stop deleted.');
};
