import { Request, Response } from 'express';

import { StopResponseDTO } from 'dto/stops/StopResponseDTO';
import { StopService } from 'services/stops/StopService';

export const create = async (req: Request, res: Response) => {
  const stopService = new StopService();
  const stop = await stopService.create({
    name: req.body.name,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  return res.customSuccess(201, 'Stop created.', new StopResponseDTO(stop));
};
