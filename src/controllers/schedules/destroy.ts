import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Schedule } from 'orm/entities/transit/Schedule';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { normalizeIdParam } from './validators';

export const destroy = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Schedule id');

  const scheduleRepository = getRepository(Schedule);
  const deleteResult = await scheduleRepository.delete(id);

  if (!deleteResult.affected) {
    throw new CustomError(404, 'General', `Schedule with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Schedule deleted.');
};
