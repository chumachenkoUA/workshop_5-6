import { Request, Response } from 'express';

import { TicketResponseDTO } from 'dto/tickets/TicketResponseDTO';
import { TicketService } from 'services/tickets/TicketService';

export const list = async (req: Request, res: Response) => {
  const ticketService = new TicketService();
  const tickets = await ticketService.findAll();

  return res.customSuccess(
    200,
    'Tickets fetched.',
    tickets.map((ticket) => new TicketResponseDTO(ticket)),
  );
};
