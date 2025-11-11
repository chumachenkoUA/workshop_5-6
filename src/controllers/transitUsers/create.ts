import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';

import { serializeTransitUser } from './serializer';
import { transitUserRelations } from './shared';
import { normalizeEmail, normalizeFullName, normalizePhone } from './validators';

export const create = async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body.email);
  const phone = normalizePhone(req.body.phone);
  const fullName = normalizeFullName(req.body.fullName);

  const transitUserRepository = getRepository(TransitUser);
  const user = transitUserRepository.create({
    email,
    phone,
    fullName,
  });

  await transitUserRepository.save(user);

  const createdUser = await transitUserRepository.findOne(user.id, {
    relations: transitUserRelations,
  });

  const userGpsLogRepository = getRepository(UserGpsLog);
  const lastGpsLog = await userGpsLogRepository.findOne({
    where: { user },
    order: { capturedAt: 'DESC' },
  });

  return res.customSuccess(201, 'Transit user created.', serializeTransitUser(createdUser || user, lastGpsLog ?? null));
};
