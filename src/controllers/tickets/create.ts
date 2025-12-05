import { Request, Response } from 'express';

import { TicketResponseDTO } from 'dto/tickets/TicketResponseDTO';
import { TicketService } from 'services/tickets/TicketService';

export const create = async (req: Request, res: Response) => {
  const ticketService = new TicketService();
  const ticket = await ticketService.create({
    tripId: req.body.tripId,
    cardId: req.body.cardId,
    price: req.body.price,
  });

  return res.customSuccess(201, 'Ticket created.', new TicketResponseDTO(ticket));
};
