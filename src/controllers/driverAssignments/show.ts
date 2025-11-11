import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeDriverAssignment } from './serializer';
import { driverAssignmentRelations } from './shared';
import { normalizeIdParam } from './validators';

export const show = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Driver assignment id');

  const driverAssignmentRepository = getRepository(DriverAssignment);
  const assignment = await driverAssignmentRepository.findOne(id, {
    relations: driverAssignmentRelations,
  });

  if (!assignment) {
    throw new CustomError(404, 'General', `Driver assignment with id:${id} not found.`);
  }

  return res.customSuccess(200, 'Driver assignment fetched.', serializeDriverAssignment(assignment));
};
