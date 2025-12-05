import { Request, Response } from 'express';

import { DriverAssignmentResponseDTO } from 'dto/driverAssignments/DriverAssignmentResponseDTO';
import { DriverAssignmentService } from 'services/driverAssignments/DriverAssignmentService';

export const edit = async (req: Request, res: Response) => {
  const driverAssignmentService = new DriverAssignmentService();
  const assignment = await driverAssignmentService.update(req.params.id, {
    driverId: req.body.driverId,
    vehicleId: req.body.vehicleId,
    assignedAt: req.body.assignedAt,
  });

  return res.customSuccess(200, 'Driver assignment updated.', new DriverAssignmentResponseDTO(assignment));
};
