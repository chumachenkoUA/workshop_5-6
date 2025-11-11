import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Schedule } from 'orm/entities/transit/Schedule';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeSchedule } from './serializer';
import { scheduleRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Schedule id');

  const scheduleRepository = getRepository(Schedule);
  const schedule = await scheduleRepository.findOne(id, {
    relations: scheduleRelations,
  });

  if (!schedule) {
    throw new CustomError(404, 'General', `Schedule with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Schedule fetched.', serializeSchedule(schedule));
};
