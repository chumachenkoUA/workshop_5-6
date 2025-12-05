import { Request, Response } from 'express';

import { RouteStopResponseDTO } from 'dto/routeStops/RouteStopResponseDTO';
import { RouteStopService } from 'services/routeStops/RouteStopService';

export const edit = async (req: Request, res: Response) => {
  const routeStopService = new RouteStopService();
  const routeStop = await routeStopService.update(req.params.id, {
    routeId: req.body.routeId,
    stopId: req.body.stopId,
    previousRouteStopId: req.body.previousRouteStopId,
    nextRouteStopId: req.body.nextRouteStopId,
  });

  return res.customSuccess(200, 'Route stop updated.', new RouteStopResponseDTO(routeStop));
};
