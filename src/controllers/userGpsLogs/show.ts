import { Request, Response } from 'express';

import { UserGpsLogResponseDTO } from 'dto/userGpsLogs/UserGpsLogResponseDTO';
import { UserGpsLogService } from 'services/userGpsLogs/UserGpsLogService';

export const show = async (req: Request, res: Response) => {
  const userGpsLogService = new UserGpsLogService();
  const log = await userGpsLogService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'User GPS log fetched.', new UserGpsLogResponseDTO(log));
};
