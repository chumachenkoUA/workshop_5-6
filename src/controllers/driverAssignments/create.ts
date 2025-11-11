import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeDriverAssignment } from './serializer';
import { driverAssignmentRelations } from './shared';
import { normalizeIdParam } from './validators';

export const create = async (req: Request, res: Response) => {
  const driverId = normalizeIdParam(req.body.driverId, 'Driver id');
  const vehicleId = normalizeIdParam(req.body.vehicleId, 'Vehicle id');
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

  const driverAssignmentRepository = getRepository(DriverAssignment);
  const assignment = driverAssignmentRepository.create({
    driver,
    vehicle,
  });

  await driverAssignmentRepository.save(assignment);

  const createdAssignment = await driverAssignmentRepository.findOne(assignment.id, {
    relations: driverAssignmentRelations,
  });

  if (!createdAssignment) {
    throw new CustomError(500, 'General', 'Driver assignment could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Driver assignment created.', serializeDriverAssignment(createdAssignment));
};
