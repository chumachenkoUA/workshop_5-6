import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Schedule } from 'orm/entities/transit/Schedule';

import { serializeSchedule } from './serializer';
import { scheduleRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const scheduleRepository = getRepository(Schedule);

  const schedules = await scheduleRepository.find({
    relations: scheduleRelations,
    order: { id: 'DESC' },
  });

  return res.customSuccess(200, 'Schedules fetched.', schedules.map(serializeSchedule));
};
