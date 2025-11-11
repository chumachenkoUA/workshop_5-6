import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

import { serializeRoute } from './serializer';
import { routeRelations } from './shared';
import { normalizeActive, normalizeDirection, normalizeNumberField, normalizeTransportTypeId } from './validators';

export const create = async (req: Request, res: Response) => {
  const transportTypeId = normalizeTransportTypeId(req.body.transportTypeId);
  const number = normalizeNumberField(req.body.number);
  const direction = normalizeDirection(req.body.direction);
  const active = normalizeActive(req.body.active);

  const transportTypeRepository = getRepository(TransportType);
  const transportType = await transportTypeRepository.findOne(transportTypeId);

  if (!transportType) {
    throw new CustomError(404, 'General', `Transport type with id:${transportTypeId} not found.`);
  }

  const routeRepository = getRepository(Route);
  const route = routeRepository.create({
    transportType,
    number,
    direction,
    active,
  });

  await routeRepository.save(route);

  const createdRoute = await routeRepository.findOne(route.id, { relations: routeRelations });

  if (!createdRoute) {
    throw new CustomError(500, 'General', 'Route could not be loaded after creation.');
  }

  return res.customSuccess(201, 'Route created.', serializeRoute(createdRoute));
};
