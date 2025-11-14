import { Request, Response } from 'express';

import { DriverAssignmentResponseDTO } from 'dto/driverAssignments/DriverAssignmentResponseDTO';
import { DriverAssignmentService } from 'services/driverAssignments/DriverAssignmentService';

export const list = async (req: Request, res: Response) => {
  const driverAssignmentService = new DriverAssignmentService();
  const assignments = await driverAssignmentService.findAll();

  return res.customSuccess(
    200,
    'Driver assignments fetched.',
    assignments.map((assignment) => new DriverAssignmentResponseDTO(assignment)),
  );
};
