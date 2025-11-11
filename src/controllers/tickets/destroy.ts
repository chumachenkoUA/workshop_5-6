import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Ticket } from 'orm/entities/transit/Ticket';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Ticket id');

  const ticketRepository = getRepository(Ticket);
  const deleteResult = await ticketRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Ticket with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Ticket deleted.');
};
