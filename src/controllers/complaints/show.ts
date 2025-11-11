import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Complaint } from 'orm/entities/transit/Complaint';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeComplaint } from './serializer';
import { complaintRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Complaint id');

  const complaintRepository = getRepository(Complaint);
  const complaint = await complaintRepository.findOne(id, {
    relations: complaintRelations,
  });

  if (!complaint) {
    throw new CustomError(404, 'General', `Complaint with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Complaint fetched.', serializeComplaint(complaint));
};
