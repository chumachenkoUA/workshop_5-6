import { getRepository } from 'typeorm';

import { RouteStop } from 'orm/entities/transit/RouteStop';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const resolveRouteStopReference = async (id: string | null, fieldLabel: string) => {
  if (!id) {
    return null;
  }

  const routeStopRepository = getRepository(RouteStop);
  const routeStop = await routeStopRepository.findOne(id);

  if (!routeStop) {
    throw new CustomError(404, 'General', `${fieldLabel} with id:${id} not found.`);
  }

  return routeStop;
};
