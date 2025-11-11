import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Complaint } from 'orm/entities/transit/Complaint';
import { TransitUser } from 'orm/entities/transit/TransitUser';
import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeComplaint } from './serializer';
import { complaintRelations } from './shared';
import { normalizeIdParam, normalizeStatus, normalizeTextField } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Complaint id');
  const userId = normalizeIdParam(req.body.userId, 'User id');
  const tripId = normalizeIdParam(req.body.tripId, 'Trip id');
  const type = normalizeTextField(req.body.type, 'Type');
  const message = normalizeTextField(req.body.message, 'Message');
  const status = normalizeStatus(req.body.status);

  const complaintRepository = getRepository(Complaint);
  const complaint = await complaintRepository.findOne(id, {
    relations: complaintRelations,
  });

  if (!complaint) {
    throw new CustomError(404, 'General', `Complaint with id:${id} not found.`);
  }

  const userRepository = getRepository(TransitUser);
  const tripRepository = getRepository(Trip);

  const [user, trip] = await Promise.all([
    userRepository.findOne(userId),
    tripRepository.findOne(tripId, { relations: ['route', 'driver'] }),
  ]);

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
  }

  if (!trip) {
    throw new CustomError(404, 'General', `Trip with id:${tripId} not found.`);
  }

  complaint.user = user;
  complaint.trip = trip;
  complaint.type = type;
  complaint.message = message;
  complaint.status = status;

  await complaintRepository.save(complaint);

  return res.customSuccess(200, 'Complaint updated.', serializeComplaint(complaint));
};
