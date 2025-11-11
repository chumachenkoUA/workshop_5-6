import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Ticket } from 'orm/entities/transit/Ticket';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTicket } from './serializer';
import { ticketRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Ticket id');

  const ticketRepository = getRepository(Ticket);
  const ticket = await ticketRepository.findOne(id, {
    relations: ticketRelations,
  });

  if (!ticket) {
    throw new CustomError(404, 'General', `Ticket with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Ticket fetched.', serializeTicket(ticket));
};
