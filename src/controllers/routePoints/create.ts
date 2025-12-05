import { Request, Response } from 'express';

import { RoutePointResponseDTO } from 'dto/routePoints/RoutePointResponseDTO';
import { RoutePointService } from 'services/routePoints/RoutePointService';

export const create = async (req: Request, res: Response) => {
  const routePointService = new RoutePointService();
  const point = await routePointService.create({
    routeId: req.body.routeId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    previousPointId: req.body.previousPointId,
    nextPointId: req.body.nextPointId,
  });

  return res.customSuccess(201, 'Route point created.', new RoutePointResponseDTO(point));
};
