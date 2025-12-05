import { Request, Response } from 'express';

import { RouteStopResponseDTO } from 'dto/routeStops/RouteStopResponseDTO';
import { RouteStopService } from 'services/routeStops/RouteStopService';

export const show = async (req: Request, res: Response) => {
  const routeStopService = new RouteStopService();
  const routeStop = await routeStopService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Route stop fetched.', new RouteStopResponseDTO(routeStop));
};
