import { Request, Response } from 'express';

import { RouteResponseDTO } from 'dto/routes/RouteResponseDTO';
import { RouteService } from 'services/routes/RouteService';

export const list = async (req: Request, res: Response) => {
  const routeService = new RouteService();
  const routes = await routeService.findAll();

  return res.customSuccess(
    200,
    'Routes fetched.',
    routes.map((route) => new RouteResponseDTO(route)),
  );
};
