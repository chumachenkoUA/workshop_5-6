import { Request, Response } from 'express';

import { TicketResponseDTO } from 'dto/tickets/TicketResponseDTO';
import { TicketService } from 'services/tickets/TicketService';

export const edit = async (req: Request, res: Response) => {
  const ticketService = new TicketService();
  const ticket = await ticketService.update(req.params.id, {
    tripId: req.body.tripId,
    cardId: req.body.cardId,
    price: req.body.price,
  });

  return res.customSuccess(200, 'Ticket updated.', new TicketResponseDTO(ticket));
};
