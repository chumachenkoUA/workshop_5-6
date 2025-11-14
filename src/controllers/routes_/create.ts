import { Request, Response } from 'express';

import { RouteResponseDTO } from 'dto/routes/RouteResponseDTO';
import { RouteService } from 'services/routes/RouteService';

export const create = async (req: Request, res: Response) => {
  const routeService = new RouteService();
  const route = await routeService.create({
    transportTypeId: req.body.transportTypeId,
    number: req.body.number,
    direction: req.body.direction,
    active: req.body.active,
  });

  return res.customSuccess(201, 'Route created.', new RouteResponseDTO(route));
};
