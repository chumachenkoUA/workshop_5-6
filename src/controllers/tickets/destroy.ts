import { Request, Response } from 'express';

import { TicketService } from 'services/tickets/TicketService';

export const destroy = async (req: Request, res: Response) => {
  const ticketService = new TicketService();
  await ticketService.delete(req.params.id);

  return res.customSuccess(200, 'Ticket deleted.');
};
