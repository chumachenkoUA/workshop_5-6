import { Request, Response } from 'express';

import { ScheduleService } from 'services/schedules/ScheduleService';

export const destroy = async (req: Request, res: Response) => {
  const scheduleService = new ScheduleService();
  await scheduleService.delete(req.params.id);

  return res.customSuccess(200, 'Schedule deleted.');
};
