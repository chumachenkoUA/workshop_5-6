import { Request, Response } from 'express';

import { ScheduleResponseDTO } from 'dto/schedules/ScheduleResponseDTO';
import { ScheduleService } from 'services/schedules/ScheduleService';

export const list = async (req: Request, res: Response) => {
  const scheduleService = new ScheduleService();
  const schedules = await scheduleService.findAll();

  return res.customSuccess(
    200,
    'Schedules fetched.',
    schedules.map((schedule) => new ScheduleResponseDTO(schedule)),
  );
};
