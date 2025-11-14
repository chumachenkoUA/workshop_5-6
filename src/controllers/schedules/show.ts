import { Request, Response } from 'express';

import { ScheduleResponseDTO } from 'dto/schedules/ScheduleResponseDTO';
import { ScheduleService } from 'services/schedules/ScheduleService';

export const show = async (req: Request, res: Response) => {
  const scheduleService = new ScheduleService();
  const schedule = await scheduleService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Schedule fetched.', new ScheduleResponseDTO(schedule));
};
