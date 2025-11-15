import { Request, Response } from 'express';

import { TripService } from 'services/trips/TripService';

export const destroy = async (req: Request, res: Response) => {
  const tripService = new TripService();
  await tripService.delete(req.params.id);

  return res.customSuccess(200, 'Trip deleted.');
};
