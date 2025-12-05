import { Request, Response } from 'express';

import { TripResponseDTO } from 'dto/trips/TripResponseDTO';
import { TripService } from 'services/trips/TripService';

export const list = async (req: Request, res: Response) => {
  const tripService = new TripService();
  const trips = await tripService.findAll();

  return res.customSuccess(
    200,
    'Trips fetched.',
    trips.map((trip) => new TripResponseDTO(trip)),
  );
};
