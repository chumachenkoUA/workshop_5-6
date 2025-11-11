import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { FineAppeal } from 'orm/entities/transit/FineAppeal';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeFineAppeal } from './serializer';
import { fineAppealRelations } from './shared';
import { normalizeIdParam, normalizeStatus, normalizeTextField } from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Fine appeal id');
  const fineId = normalizeIdParam(req.body.fineId, 'Fine id');
  const message = normalizeTextField(req.body.message, 'Message');
  const status = normalizeStatus(req.body.status);

  const fineAppealRepository = getRepository(FineAppeal);
  const appeal = await fineAppealRepository.findOne(id, {
    relations: fineAppealRelations,
  });

  if (!appeal) {
    throw new CustomError(404, 'General', `Fine appeal with id:${id} not found.`);
  }

  const fineRepository = getRepository(Fine);
  const fine = await fineRepository.findOne(fineId, {
    relations: ['user', 'trip', 'trip.route'],
  });

  if (!fine) {
    throw new CustomError(404, 'General', `Fine with id:${fineId} not found.`);
  }

  appeal.fine = fine;
  appeal.message = message;
  appeal.status = status;

  await fineAppealRepository.save(appeal);

  return res.customSuccess(200, 'Fine appeal updated.', serializeFineAppeal(appeal));
};
