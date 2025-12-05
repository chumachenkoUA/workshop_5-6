import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = [
  'transportType',
  'routeStops',
  'routeStops.stop',
  'routeStops.previousStop',
  'routeStops.nextStop',
  'routePoints',
  'routePoints.previousPoint',
  'routePoints.nextPoint',
  'vehicles',
  'vehicles.transportType',
  'schedule',
];

type RoutePayload = {
  transportTypeId: string;
  number: string;
  direction: string;
  active: boolean;
};

export class RouteService {
  private routeRepository = getRepository(Route);
  private transportTypeRepository = getRepository(TransportType);

  public async findAll(): Promise<Route[]> {
    return this.routeRepository.find({
      relations: RELATIONS,
      order: { id: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne(id, { relations: RELATIONS });
    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${id} not found.`);
    }
    return route;
  }

  public async create(payload: RoutePayload): Promise<Route> {
    const transportType = await this.transportTypeRepository.findOne(payload.transportTypeId);
    if (!transportType) {
      throw new CustomError(404, 'General', `Transport type with id:${payload.transportTypeId} not found.`);
    }

    const route = this.routeRepository.create({
      transportType,
      number: payload.number,
      direction: payload.direction,
      active: payload.active,
    });

    const saved = await this.routeRepository.save(route);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: RoutePayload): Promise<Route> {
    const route = await this.findOneOrFail(id);
    const transportType = await this.transportTypeRepository.findOne(payload.transportTypeId);
    if (!transportType) {
      throw new CustomError(404, 'General', `Transport type with id:${payload.transportTypeId} not found.`);
    }

    route.transportType = transportType;
    route.number = payload.number;
    route.direction = payload.direction;
    route.active = payload.active;

    await this.routeRepository.save(route);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.routeRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Route with id:${id} not found.`);
    }
  }
}
