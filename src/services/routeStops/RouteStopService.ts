import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { RouteStop } from 'orm/entities/transit/RouteStop';
import { Stop } from 'orm/entities/transit/Stop';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = [
  'route',
  'route.transportType',
  'stop',
  'previousStop',
  'previousStop.stop',
  'nextStop',
  'nextStop.stop',
];

type RouteStopPayload = {
  routeId: string;
  stopId: string;
  previousRouteStopId: string | null;
  nextRouteStopId: string | null;
};

export class RouteStopService {
  private routeStopRepository = getRepository(RouteStop);
  private routeRepository = getRepository(Route);
  private stopRepository = getRepository(Stop);

  public async findAll(): Promise<RouteStop[]> {
    return this.routeStopRepository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string): Promise<RouteStop> {
    const routeStop = await this.routeStopRepository.findOne(id, { relations: RELATIONS });
    if (!routeStop) {
      throw new CustomError(404, 'General', `Route stop with id:${id} not found.`);
    }
    return routeStop;
  }

  public async create(payload: RouteStopPayload): Promise<RouteStop> {
    const [route, stop] = await Promise.all([
      this.routeRepository.findOne(payload.routeId, { relations: ['transportType'] }),
      this.stopRepository.findOne(payload.stopId),
    ]);

    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    if (!stop) {
      throw new CustomError(404, 'General', `Stop with id:${payload.stopId} not found.`);
    }

    const [previousStop, nextStop] = await Promise.all([
      this.resolveRouteStop(payload.previousRouteStopId, 'Previous route stop'),
      this.resolveRouteStop(payload.nextRouteStopId, 'Next route stop'),
    ]);

    const routeStop = this.routeStopRepository.create({
      route,
      stop,
      previousStop,
      nextStop,
    });

    const saved = await this.routeStopRepository.save(routeStop);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: RouteStopPayload): Promise<RouteStop> {
    const routeStop = await this.findOneOrFail(id);

    const [route, stop] = await Promise.all([
      this.routeRepository.findOne(payload.routeId, { relations: ['transportType'] }),
      this.stopRepository.findOne(payload.stopId),
    ]);

    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    if (!stop) {
      throw new CustomError(404, 'General', `Stop with id:${payload.stopId} not found.`);
    }

    const [previousStop, nextStop] = await Promise.all([
      this.resolveRouteStop(payload.previousRouteStopId, 'Previous route stop'),
      this.resolveRouteStop(payload.nextRouteStopId, 'Next route stop'),
    ]);

    routeStop.route = route;
    routeStop.stop = stop;
    routeStop.previousStop = previousStop;
    routeStop.nextStop = nextStop;

    await this.routeStopRepository.save(routeStop);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.routeStopRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Route stop with id:${id} not found.`);
    }
  }

  private async resolveRouteStop(id: string | null, fieldLabel: string): Promise<RouteStop | null> {
    if (!id) {
      return null;
    }

    const routeStop = await this.routeStopRepository.findOne(id);
    if (!routeStop) {
      throw new CustomError(404, 'General', `${fieldLabel} with id:${id} not found.`);
    }

    return routeStop;
  }
}
