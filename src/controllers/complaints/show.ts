import { Request, Response } from 'express';

import { ComplaintResponseDTO } from 'dto/complaints/ComplaintResponseDTO';
import { ComplaintService } from 'services/complaints/ComplaintService';

export const show = async (req: Request, res: Response) => {
  const complaintService = new ComplaintService();
  const complaint = await complaintService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Complaint fetched.', new ComplaintResponseDTO(complaint));
};
