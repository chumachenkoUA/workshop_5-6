import { Request, Response } from 'express';

import { ComplaintResponseDTO } from 'dto/complaints/ComplaintResponseDTO';
import { ComplaintService } from 'services/complaints/ComplaintService';

export const list = async (req: Request, res: Response) => {
  const complaintService = new ComplaintService();
  const complaints = await complaintService.findAll();

  return res.customSuccess(
    200,
    'Complaints fetched.',
    complaints.map((complaint) => new ComplaintResponseDTO(complaint)),
  );
};
