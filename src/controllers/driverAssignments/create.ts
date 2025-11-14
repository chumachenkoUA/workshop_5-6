import { Request, Response } from 'express';

import { DriverAssignmentResponseDTO } from 'dto/driverAssignments/DriverAssignmentResponseDTO';
import { DriverAssignmentService } from 'services/driverAssignments/DriverAssignmentService';

export const create = async (req: Request, res: Response) => {
  const driverAssignmentService = new DriverAssignmentService();
  const assignment = await driverAssignmentService.create({
    driverId: req.body.driverId,
    vehicleId: req.body.vehicleId,
    assignedAt: req.body.assignedAt,
  });

  return res.customSuccess(201, 'Driver assignment created.', new DriverAssignmentResponseDTO(assignment));
};
