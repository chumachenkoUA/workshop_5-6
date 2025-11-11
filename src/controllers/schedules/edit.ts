import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { Schedule } from 'orm/entities/transit/Schedule';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeSchedule } from './serializer';
import { scheduleRelations } from './shared';
import { normalizeIdParam, normalizeIntervalMinutes, normalizeRouteId, normalizeTimeField } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Schedule id');
  const routeId = normalizeRouteId(req.body.routeId);
  const workdayStart = normalizeTimeField(req.body.workdayStart, 'Workday start');
  const workdayEnd = normalizeTimeField(req.body.workdayEnd, 'Workday end');
  const intervalMinutes = normalizeIntervalMinutes(req.body.intervalMinutes);

  const scheduleRepository = getRepository(Schedule);
  const schedule = await scheduleRepository.findOne(id, {
    relations: scheduleRelations,
  });

  if (!schedule) {
    throw new CustomError(404, 'General', `Schedule with id:${id} not found.`);
  }

  const routeRepository = getRepository(Route);
  const route = await routeRepository.findOne(routeId, { relations: ['transportType'] });

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${routeId} not found.`);
  }

  schedule.route = route;
  schedule.workdayStart = workdayStart;
  schedule.workdayEnd = workdayEnd;
  schedule.intervalMinutes = intervalMinutes;

  await scheduleRepository.save(schedule);

  return res.customSuccess(200, 'Schedule updated.', serializeSchedule(schedule));
};
