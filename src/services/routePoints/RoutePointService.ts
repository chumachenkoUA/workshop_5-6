import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { RoutePoint } from 'orm/entities/transit/RoutePoint';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['route', 'route.transportType', 'previousPoint', 'nextPoint'];

type RoutePointPayload = {
  routeId: string;
  latitude: string;
  longitude: string;
  previousPointId: string | null;
  nextPointId: string | null;
};

export class RoutePointService {
  private routePointRepository = getRepository(RoutePoint);
  private routeRepository = getRepository(Route);

  public async findAll(): Promise<RoutePoint[]> {
    return this.routePointRepository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string): Promise<RoutePoint> {
    const point = await this.routePointRepository.findOne(id, { relations: RELATIONS });
    if (!point) {
      throw new CustomError(404, 'General', `Route point with id:${id} not found.`);
    }
    return point;
  }

  public async create(payload: RoutePointPayload): Promise<RoutePoint> {
    const route = await this.routeRepository.findOne(payload.routeId, { relations: ['transportType'] });
    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    const [previousPoint, nextPoint] = await Promise.all([
      this.resolvePoint(payload.previousPointId, 'Previous route point'),
      this.resolvePoint(payload.nextPointId, 'Next route point'),
    ]);

    const point = this.routePointRepository.create({
      route,
      latitude: payload.latitude,
      longitude: payload.longitude,
      previousPoint,
      nextPoint,
    });

    const saved = await this.routePointRepository.save(point);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: RoutePointPayload): Promise<RoutePoint> {
    const point = await this.findOneOrFail(id);
    const route = await this.routeRepository.findOne(payload.routeId, { relations: ['transportType'] });
    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    const [previousPoint, nextPoint] = await Promise.all([
      this.resolvePoint(payload.previousPointId, 'Previous route point'),
      this.resolvePoint(payload.nextPointId, 'Next route point'),
    ]);

    point.route = route;
    point.latitude = payload.latitude;
    point.longitude = payload.longitude;
    point.previousPoint = previousPoint;
    point.nextPoint = nextPoint;

    await this.routePointRepository.save(point);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.routePointRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Route point with id:${id} not found.`);
    }
  }

  private async resolvePoint(id: string | null, fieldLabel: string): Promise<RoutePoint | null> {
    if (!id) {
      return null;
    }

    const point = await this.routePointRepository.findOne(id);
    if (!point) {
      throw new CustomError(404, 'General', `${fieldLabel} with id:${id} not found.`);
    }

    return point;
  }
}
