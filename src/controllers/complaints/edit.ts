import { Request, Response } from 'express';

import { ComplaintResponseDTO } from 'dto/complaints/ComplaintResponseDTO';
import { ComplaintService } from 'services/complaints/ComplaintService';

export const edit = async (req: Request, res: Response) => {
  const complaintService = new ComplaintService();
  const complaint = await complaintService.update(req.params.id, {
    userId: req.body.userId,
    tripId: req.body.tripId,
    type: req.body.type,
    message: req.body.message,
    status: req.body.status,
  });

  return res.customSuccess(200, 'Complaint updated.', new ComplaintResponseDTO(complaint));
};
