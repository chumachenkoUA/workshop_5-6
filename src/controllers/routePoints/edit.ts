import { Request, Response } from 'express';

import { RoutePointResponseDTO } from 'dto/routePoints/RoutePointResponseDTO';
import { RoutePointService } from 'services/routePoints/RoutePointService';

export const edit = async (req: Request, res: Response) => {
  const routePointService = new RoutePointService();
  const point = await routePointService.update(req.params.id, {
    routeId: req.body.routeId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    previousPointId: req.body.previousPointId,
    nextPointId: req.body.nextPointId,
  });

  return res.customSuccess(200, 'Route point updated.', new RoutePointResponseDTO(point));
};
