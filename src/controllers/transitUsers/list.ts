import { Request, Response } from 'express';

import { TransitUserResponseDTO } from 'dto/transitUsers/TransitUserResponseDTO';
import { TransitUserService } from 'services/transitUsers/TransitUserService';

export const list = async (req: Request, res: Response) => {
  const transitUserService = new TransitUserService();
  const results = await transitUserService.findAll();

  return res.customSuccess(
    200,
    'Transit users fetched.',
    results.map((result) => new TransitUserResponseDTO(result.user, result.lastGpsLog)),
  );
};
