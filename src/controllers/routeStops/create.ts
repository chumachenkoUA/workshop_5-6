import { Request, Response } from 'express';

import { RouteStopResponseDTO } from 'dto/routeStops/RouteStopResponseDTO';
import { RouteStopService } from 'services/routeStops/RouteStopService';

export const create = async (req: Request, res: Response) => {
  const routeStopService = new RouteStopService();
  const routeStop = await routeStopService.create({
    routeId: req.body.routeId,
    stopId: req.body.stopId,
    previousRouteStopId: req.body.previousRouteStopId,
    nextRouteStopId: req.body.nextRouteStopId,
  });

  return res.customSuccess(201, 'Route stop created.', new RouteStopResponseDTO(routeStop));
};
