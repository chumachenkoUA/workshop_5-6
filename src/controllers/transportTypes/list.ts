import { Request, Response } from 'express';

import { TransportTypeResponseDTO } from 'dto/transportTypes/TransportTypeResponseDTO';
import { TransportTypeService } from 'services/transportTypes/TransportTypeService';

export const list = async (req: Request, res: Response) => {
  const transportTypeService = new TransportTypeService();
  const transportTypes = await transportTypeService.findAll();

  return res.customSuccess(
    200,
    'Transport types fetched.',
    transportTypes.map((transportType) => new TransportTypeResponseDTO(transportType)),
  );
};
