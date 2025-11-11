import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeTransitUser } from './serializer';
import { transitUserRelations } from './shared';
import { normalizeEmail, normalizeFullName, normalizeIdParam, normalizePhone } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Transit user id');
  const email = normalizeEmail(req.body.email);
  const phone = normalizePhone(req.body.phone);
  const fullName = normalizeFullName(req.body.fullName);

  const transitUserRepository = getRepository(TransitUser);
  const user = await transitUserRepository.findOne(id, { relations: transitUserRelations });

  if (!user) {
    throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
  }

  user.email = email;
  user.phone = phone;
  user.fullName = fullName;

  await transitUserRepository.save(user);

  const userGpsLogRepository = getRepository(UserGpsLog);
  const lastGpsLog = await userGpsLogRepository.findOne({
    where: { user },
    order: { capturedAt: 'DESC' },
  });

  return res.customSuccess(200, 'Transit user updated.', serializeTransitUser(user, lastGpsLog ?? null));
};
