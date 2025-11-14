import { Request, Response } from 'express';

import { RouteResponseDTO } from 'dto/routes/RouteResponseDTO';
import { RouteService } from 'services/routes/RouteService';

export const show = async (req: Request, res: Response) => {
  const routeService = new RouteService();
  const route = await routeService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Route fetched.', new RouteResponseDTO(route));
};
