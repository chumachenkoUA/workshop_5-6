import { Request, Response } from 'express';

import { DriverAssignmentService } from 'services/driverAssignments/DriverAssignmentService';

export const destroy = async (req: Request, res: Response) => {
  const driverAssignmentService = new DriverAssignmentService();
  await driverAssignmentService.delete(req.params.id);

  return res.customSuccess(200, 'Driver assignment deleted.');
};
