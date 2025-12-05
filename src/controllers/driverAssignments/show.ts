import { Request, Response } from 'express';

import { DriverAssignmentResponseDTO } from 'dto/driverAssignments/DriverAssignmentResponseDTO';
import { DriverAssignmentService } from 'services/driverAssignments/DriverAssignmentService';

export const show = async (req: Request, res: Response) => {
  const driverAssignmentService = new DriverAssignmentService();
  const assignment = await driverAssignmentService.findOneOrFail(req.params.id);

  return res.customSuccess(200, 'Driver assignment fetched.', new DriverAssignmentResponseDTO(assignment));
};
