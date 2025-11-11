import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { Schedule } from 'orm/entities/transit/Schedule';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeSchedule } from './serializer';
import { scheduleRelations } from './shared';
import { normalizeIntervalMinutes, normalizeRouteId, normalizeTimeField } from './validators';

export const create = async (req: Request, res: Response) => {
  const routeId = normalizeRouteId(req.body.routeId);
  const workdayStart = normalizeTimeField(req.body.workdayStart, 'Workday start');
  const workdayEnd = normalizeTimeField(req.body.workdayEnd, 'Workday end');
  const intervalMinutes = normalizeIntervalMinutes(req.body.intervalMinutes);

  const routeRepository = getRepository(Route);
  const route = await routeRepository.findOne(routeId, { relations: ['transportType', 'schedule'] });

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  if (route.schedule) {
    throw new CustomError(409, 'General', `Route with id:${routeId} already has a schedule.`);
  }

  const scheduleRepository = getRepository(Schedule);
  const schedule = scheduleRepository.create({
    route,
    workdayStart,
    workdayEnd,
    intervalMinutes,
  });

  await scheduleRepository.save(schedule);

  const createdSchedule = await scheduleRepository.findOne(schedule.id, {
    relations: scheduleRelations,
  });

  if (!createdSchedule) {
    throw new CustomError(500, 'General', 'Schedule could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Schedule created.', serializeSchedule(createdSchedule));
};
