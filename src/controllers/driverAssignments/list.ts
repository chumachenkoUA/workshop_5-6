import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';

import { serializeDriverAssignment } from './serializer';
import { driverAssignmentRelations } from './shared';

export const list = async (req: Request, res: Response) => {
  const driverAssignmentRepository = getRepository(DriverAssignment);

  const assignments = await driverAssignmentRepository.find({
    relations: driverAssignmentRelations,
    order: { assignedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Driver assignments fetched.', assignments.map(serializeDriverAssignment));
};
