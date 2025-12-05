import { Request, Response } from 'express';

import { RoutePointService } from 'services/routePoints/RoutePointService';

export const destroy = async (req: Request, res: Response) => {
  const routePointService = new RoutePointService();
  await routePointService.delete(req.params.id);

  return res.customSuccess(200, 'Route point deleted.');
};
