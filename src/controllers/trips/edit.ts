import { Request, Response } from 'express';

import { TripResponseDTO } from 'dto/trips/TripResponseDTO';
import { TripService } from 'services/trips/TripService';

export const edit = async (req: Request, res: Response) => {
  const tripService = new TripService();
  const trip = await tripService.update(req.params.id, {
    routeId: req.body.routeId,
    vehicleId: req.body.vehicleId,
    driverId: req.body.driverId,
    startedAt: req.body.startedAt,
    endedAt: req.body.endedAt,
    passengerCount: req.body.passengerCount,
  });

  return res.customSuccess(200, 'Trip updated.', new TripResponseDTO(trip));
};
