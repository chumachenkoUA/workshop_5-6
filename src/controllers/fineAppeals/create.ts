import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { FineAppeal } from 'orm/entities/transit/FineAppeal';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeFineAppeal } from './serializer';
import { fineAppealRelations } from './shared';
import { normalizeIdParam, normalizeStatus, normalizeTextField } from './validators';

export const create = async (req: Request, res: Response) => {
  const fineId = normalizeIdParam(req.body.fineId, 'Fine id');
  const message = normalizeTextField(req.body.message, 'Message');
  const status = normalizeStatus(req.body.status);

  const fineRepository = getRepository(Fine);
  const fine = await fineRepository.findOne(fineId, {
    relations: ['user', 'trip', 'trip.route'],
  });

  if (!fine) {
    throw new CustomError(404, 'General', `Fine with id:${fineId} not found.`);
  }

  const fineAppealRepository = getRepository(FineAppeal);
  if (fine.appeal) {
    throw new CustomError(409, 'General', `Fine with id:${fineId} already has an appeal.`);
  }

  const appeal = fineAppealRepository.create({
    fine,
    message,
    status,
  });

  await fineAppealRepository.save(appeal);

  const createdAppeal = await fineAppealRepository.findOne(appeal.id, {
    relations: fineAppealRelations,
  });

  if (!createdAppeal) {
    throw new CustomError(500, 'General', 'Fine appeal could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Fine appeal created.', serializeFineAppeal(createdAppeal));
};
