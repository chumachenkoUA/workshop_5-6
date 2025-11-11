import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Complaint } from 'orm/entities/transit/Complaint';

import { serializeComplaint } from './serializer';
import { complaintRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const complaintRepository = getRepository(Complaint);

  const complaints = await complaintRepository.find({
    relations: complaintRelations,
    order: { id: 'DESC' },
  });

  return res.customSuccess(200, 'Complaints fetched.', complaints.map(serializeComplaint));
};
