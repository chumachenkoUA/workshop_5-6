import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeRoute } from './serializer';
import { routeRelations } from './shared';
import {
  normalizeActive,
  normalizeDirection,
  normalizeIdParam,
  normalizeNumberField,
  normalizeTransportTypeId,
} from './validators';

export const edit = async (req: Request, res: Response) => {
  const id = normalizeIdParam(req.params.id, 'Route id');
  const transportTypeId = normalizeTransportTypeId(req.body.transportTypeId);
  const number = normalizeNumberField(req.body.number);
  const direction = normalizeDirection(req.body.direction);
  const active = normalizeActive(req.body.active);

  const routeRepository = getRepository(Route);
  const route = await routeRepository.findOne(id, { relations: routeRelations });

  if (!route) {
    throw new CustomError(404, 'General', `Route with id:${id} not found.`);
  }

  const transportTypeRepository = getRepository(TransportType);
  const transportType = await transportTypeRepository.findOne(transportTypeId);

  if (!transportType) {
    throw new CustomError(404, 'General', `Transport type with id:${transportTypeId} not found.`);
  }

  route.transportType = transportType;
  route.number = number;
  route.direction = direction;
  route.active = active;

  await routeRepository.save(route);

  return res.customSuccess(200, 'Route updated.', serializeRoute(route));
};
