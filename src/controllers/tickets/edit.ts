import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Ticket } from 'orm/entities/transit/Ticket';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTicket } from './serializer';
import { ticketRelations } from './shared';
import { normalizeCardId, normalizeIdParam, normalizePrice, normalizeTripId } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Ticket id');
  const tripId = normalizeTripId(req.body.tripId);
  const cardId = normalizeCardId(req.body.cardId);
  const price = normalizePrice(req.body.price);

  const ticketRepository = getRepository(Ticket);
  const ticket = await ticketRepository.findOne(id, { relations: ticketRelations });

  if (!ticket) {
    throw new CustomError(404, 'General', `Ticket with id:${id} not found.`);
  }

  const tripRepository = getRepository(Trip);
  const cardRepository = getRepository(TransportCard);

  const [trip, card] = await Promise.all([
    tripRepository.findOne(tripId, { relations: ['route', 'route.transportType', 'vehicle', 'driver'] }),
    cardRepository.findOne(cardId, { relations: ['user'] }),
  ]);

  if (!trip) {
    throw new CustomError(404, 'General', `Trip with id:${tripId} not found.`);
  }

  if (!card) {
    throw new CustomError(404, 'General', `Transport card with id:${cardId} not found.`);
  }

  ticket.trip = trip;
  ticket.card = card;
  ticket.price = price;

  await ticketRepository.save(ticket);

  return res.customSuccess(200, 'Ticket updated.', serializeTicket(ticket));
};
