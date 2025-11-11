import { getRepository } from 'typeorm';

import { RoutePoint } from 'orm/entities/transit/RoutePoint';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const resolveRoutePointReference = async (id: string | null, fieldLabel: string) => {
  if (!id) {
    return null;
  }

  const routePointRepository = getRepository(RoutePoint);
  const point = await routePointRepository.findOne(id);

  if (!point) {
    throw new CustomError(404, 'General', `${fieldLabel} with id:${id} not found.`);
  }

  return point;
};
