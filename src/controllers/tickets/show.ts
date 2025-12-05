import { Request, Response } from 'express';

import { TicketResponseDTO } from 'dto/tickets/TicketResponseDTO';
import { TicketService } from 'services/tickets/TicketService';

export const show = async (req: Request, res: Response) => {
  const ticketService = new TicketService();
  const ticket = await ticketService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Ticket fetched.', new TicketResponseDTO(ticket));
};
