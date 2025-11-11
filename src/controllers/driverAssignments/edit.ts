import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeDriverAssignment } from './serializer';
import { driverAssignmentRelations } from './shared';
import { normalizeIdParam } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Driver assignment id');
  const driverId = normalizeIdParam(req.body.driverId, 'Driver id');
  const vehicleId = normalizeIdParam(req.body.vehicleId, 'Vehicle id');
  const driverAssignmentRepository = getRepository(DriverAssignment);
  const assignment = await driverAssignmentRepository.findOne(id, {
    relations: driverAssignmentRelations,
  });

  if (!assignment) {
    throw new CustomError(404, 'General', `Driver assignment with id:${id} not found.`);
  }

  const driverRepository = getRepository(Driver);
  const vehicleRepository = getRepository(Vehicle);

  const [driver, vehicle] = await Promise.all([
    driverRepository.findOne(driverId),
    vehicleRepository.findOne(vehicleId, { relations: ['route'] }),
  ]);

  if (!driver) {
    throw new CustomError(404, 'General', `Driver with id:${driverId} not found.`);
  }

  if (!vehicle) {
    throw new CustomError(404, 'General', `Vehicle with id:${vehicleId} not found.`);
  }

  assignment.driver = driver;
  assignment.vehicle = vehicle;

  await driverAssignmentRepository.save(assignment);

  return res.customSuccess(200, 'Driver assignment updated.', serializeDriverAssignment(assignment));
};
