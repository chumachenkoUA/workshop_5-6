import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Ticket } from 'orm/entities/transit/Ticket';

import { serializeTicket } from './serializer';
import { ticketRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const ticketRepository = getRepository(Ticket);

  const tickets = await ticketRepository.find({
    relations: ticketRelations,
    order: { purchasedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Tickets fetched.', tickets.map(serializeTicket));
};
