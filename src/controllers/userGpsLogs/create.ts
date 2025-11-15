import { Request, Response } from 'express';

import { UserGpsLogResponseDTO } from 'dto/userGpsLogs/UserGpsLogResponseDTO';
import { UserGpsLogService } from 'services/userGpsLogs/UserGpsLogService';

export const create = async (req: Request, res: Response) => {
  const userGpsLogService = new UserGpsLogService();
  const log = await userGpsLogService.create({
    userId: req.body.userId,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
  });

  return res.customSuccess(201, 'User GPS log created.', new UserGpsLogResponseDTO(log));
};
