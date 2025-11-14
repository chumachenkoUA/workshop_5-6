import { Request, Response } from 'express';

import { RoutePointResponseDTO } from 'dto/routePoints/RoutePointResponseDTO';
import { RoutePointService } from 'services/routePoints/RoutePointService';

export const list = async (req: Request, res: Response) => {
  const routePointService = new RoutePointService();
  const points = await routePointService.findAll();

  return res.customSuccess(
    200,
    'Route points fetched.',
    points.map((point) => new RoutePointResponseDTO(point)),
  );
};
