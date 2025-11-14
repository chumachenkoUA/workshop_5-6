import { Request, Response } from 'express';

import { RouteStopService } from 'services/routeStops/RouteStopService';

export const destroy = async (req: Request, res: Response) => {
  const routeStopService = new RouteStopService();
  await routeStopService.delete(req.params.id);

  return res.customSuccess(200, 'Route stop deleted.');
};
