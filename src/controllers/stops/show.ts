import { Request, Response } from 'express';

import { StopResponseDTO } from 'dto/stops/StopResponseDTO';
import { StopService } from 'services/stops/StopService';

export const show = async (req: Request, res: Response) => {
  const stopService = new StopService();
  const stop = await stopService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Stop fetched.', new StopResponseDTO(stop));
};
