import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Complaint } from 'orm/entities/transit/Complaint';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Complaint id');

  const complaintRepository = getRepository(Complaint);
  const deleteResult = await complaintRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Complaint with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Complaint deleted.');
};
