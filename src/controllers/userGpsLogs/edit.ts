import { Request, Response } from 'express';

import { UserGpsLogResponseDTO } from 'dto/userGpsLogs/UserGpsLogResponseDTO';
import { UserGpsLogService } from 'services/userGpsLogs/UserGpsLogService';

export const edit = async (req: Request, res: Response) => {
  const userGpsLogService = new UserGpsLogService();
  const log = await userGpsLogService.update(req.params.id, {
    userId: req.body.userId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  return res.customSuccess(200, 'User GPS log updated.', new UserGpsLogResponseDTO(log));
};
