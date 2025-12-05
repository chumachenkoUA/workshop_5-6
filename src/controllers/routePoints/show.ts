import { Request, Response } from 'express';

import { RoutePointResponseDTO } from 'dto/routePoints/RoutePointResponseDTO';
import { RoutePointService } from 'services/routePoints/RoutePointService';

export const show = async (req: Request, res: Response) => {
  const routePointService = new RoutePointService();
  const point = await routePointService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Route point fetched.', new RoutePointResponseDTO(point));
};
