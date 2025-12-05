import { Request, Response } from 'express';

import { RouteStopResponseDTO } from 'dto/routeStops/RouteStopResponseDTO';
import { RouteStopService } from 'services/routeStops/RouteStopService';

export const list = async (req: Request, res: Response) => {
  const routeStopService = new RouteStopService();
  const routeStops = await routeStopService.findAll();

  return res.customSuccess(
    200,
    'Route stops fetched.',
    routeStops.map((routeStop) => new RouteStopResponseDTO(routeStop)),
  );
};
