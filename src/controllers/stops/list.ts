import { Request, Response } from 'express';

import { StopResponseDTO } from 'dto/stops/StopResponseDTO';
import { StopService } from 'services/stops/StopService';

export const list = async (req: Request, res: Response) => {
  const stopService = new StopService();
  const stops = await stopService.findAll();

  return res.customSuccess(
    200,
    'Stops fetched.',
    stops.map((stop) => new StopResponseDTO(stop)),
  );
};
