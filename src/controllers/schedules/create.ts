import { Request, Response } from 'express';

import { ScheduleResponseDTO } from 'dto/schedules/ScheduleResponseDTO';
import { ScheduleService } from 'services/schedules/ScheduleService';

export const create = async (req: Request, res: Response) => {
  const scheduleService = new ScheduleService();
  const schedule = await scheduleService.create({
    routeId: req.body.routeId,
    workdayStart: req.body.workdayStart,
    workdayEnd: req.body.workdayEnd,
    intervalMinutes: req.body.intervalMinutes,
  });

  return res.customSuccess(201, 'Schedule created.', new ScheduleResponseDTO(schedule));
};
