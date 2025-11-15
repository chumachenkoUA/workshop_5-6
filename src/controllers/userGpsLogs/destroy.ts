import { Request, Response } from 'express';

import { UserGpsLogService } from 'services/userGpsLogs/UserGpsLogService';

export const destroy = async (req: Request, res: Response) => {
  const userGpsLogService = new UserGpsLogService();
  await userGpsLogService.delete(req.params.id);

  return res.customSuccess(200, 'User GPS log deleted.');
};
