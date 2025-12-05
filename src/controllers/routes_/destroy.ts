import { Request, Response } from 'express';

import { RouteService } from 'services/routes/RouteService';

export const destroy = async (req: Request, res: Response) => {
  const routeService = new RouteService();
  await routeService.delete(req.params.id);

  return res.customSuccess(200, 'Route deleted.');
};
