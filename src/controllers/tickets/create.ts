import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Ticket } from 'orm/entities/transit/Ticket';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTicket } from './serializer';
import { ticketRelations } from './shared';
import { normalizeCardId, normalizePrice, normalizeTripId } from './validators';

export const create = async (req: Request, res: Response) => {
  const tripId = normalizeTripId(req.body.tripId);
  const cardId = normalizeCardId(req.body.cardId);
  const price = normalizePrice(req.body.price);

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

  const ticketRepository = getRepository(Ticket);
  const ticket = ticketRepository.create({
    trip,
    card,
    price,
  });

  await ticketRepository.save(ticket);

  const createdTicket = await ticketRepository.findOne(ticket.id, {
    relations: ticketRelations,
  });

  if (!createdTicket) {
    throw new CustomError(500, 'General', 'Ticket could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Ticket created.', serializeTicket(createdTicket));
};
