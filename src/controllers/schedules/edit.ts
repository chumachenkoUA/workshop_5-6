import { Request, Response } from 'express';

import { ScheduleResponseDTO } from 'dto/schedules/ScheduleResponseDTO';
import { ScheduleService } from 'services/schedules/ScheduleService';

export const edit = async (req: Request, res: Response) => {
  const scheduleService = new ScheduleService();
  const schedule = await scheduleService.update(req.params.id, {
    routeId: req.body.routeId,
    workdayStart: req.body.workdayStart,
    workdayEnd: req.body.workdayEnd,
    intervalMinutes: req.body.intervalMinutes,
  });

  return res.customSuccess(200, 'Schedule updated.', new ScheduleResponseDTO(schedule));
};
