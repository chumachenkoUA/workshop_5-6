import { Request, Response } from 'express';

import { ComplaintService } from 'services/complaints/ComplaintService';

export const destroy = async (req: Request, res: Response) => {
  const complaintService = new ComplaintService();
  await complaintService.delete(req.params.id);

  return res.customSuccess(200, 'Complaint deleted.');
};
