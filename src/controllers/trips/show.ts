import { Request, Response } from 'express';

import { TripResponseDTO } from 'dto/trips/TripResponseDTO';
import { TripService } from 'services/trips/TripService';

export const show = async (req: Request, res: Response) => {
  const tripService = new TripService();
  const trip = await tripService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Trip fetched.', new TripResponseDTO(trip));
};
