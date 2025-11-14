import { Request, Response } from 'express';

import { ComplaintResponseDTO } from 'dto/complaints/ComplaintResponseDTO';
import { ComplaintService } from 'services/complaints/ComplaintService';

export const create = async (req: Request, res: Response) => {
  const complaintService = new ComplaintService();
  const complaint = await complaintService.create({
    userId: req.body.userId,
    tripId: req.body.tripId,
    type: req.body.type,
    message: req.body.message,
    status: req.body.status,
  });

  return res.customSuccess(201, 'Complaint created.', new ComplaintResponseDTO(complaint));
};
