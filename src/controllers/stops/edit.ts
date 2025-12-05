import { Request, Response } from 'express';

import { StopResponseDTO } from 'dto/stops/StopResponseDTO';
import { StopService } from 'services/stops/StopService';

export const edit = async (req: Request, res: Response) => {
  const stopService = new StopService();
  const stop = await stopService.update(req.params.id, {
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  return res.customSuccess(200, 'Stop updated.', new StopResponseDTO(stop));
};
