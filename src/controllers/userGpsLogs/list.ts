import { Request, Response } from 'express';

import { UserGpsLogResponseDTO } from 'dto/userGpsLogs/UserGpsLogResponseDTO';
import { UserGpsLogService } from 'services/userGpsLogs/UserGpsLogService';

export const list = async (req: Request, res: Response) => {
  const userGpsLogService = new UserGpsLogService();
  const logs = await userGpsLogService.findAll();

  return res.customSuccess(
    200,
    'User GPS logs fetched.',
    logs.map((log) => new UserGpsLogResponseDTO(log)),
  );
};
