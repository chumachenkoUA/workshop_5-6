import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { Route } from 'orm/entities/transit/Route';
import { Trip } from 'orm/entities/transit/Trip';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['route', 'vehicle', 'driver'];

type TripPayload = {
  routeId: string;
  vehicleId: string;
  driverId: string;
  startedAt: Date;
  endedAt: Date;
  passengerCount: number;
};

export class TripService {
  private tripRepository = getRepository(Trip);
  private routeRepository = getRepository(Route);
  private vehicleRepository = getRepository(Vehicle);
  private driverRepository = getRepository(Driver);

  public async findAll(): Promise<Trip[]> {
    return this.tripRepository.find({
      relations: RELATIONS,
      order: { startedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne(id, { relations: RELATIONS });
    if (!trip) {
      throw new CustomError(404, 'General', `Trip with id:${id} not found.`);
    }
    return trip;
  }

  public async create(payload: TripPayload): Promise<Trip> {
    const [route, vehicle, driver] = await this.resolveRelations(payload);

    const trip = this.tripRepository.create({
      route,
      vehicle,
      driver,
      startedAt: payload.startedAt,
      endedAt: payload.endedAt,
      passengerCount: payload.passengerCount,
    });

    const saved = await this.tripRepository.save(trip);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: TripPayload): Promise<Trip> {
    const trip = await this.findOneOrFail(id);
    const [route, vehicle, driver] = await this.resolveRelations(payload);

    trip.route = route;
    trip.vehicle = vehicle;
    trip.driver = driver;
    trip.startedAt = payload.startedAt;
    trip.endedAt = payload.endedAt;
    trip.passengerCount = payload.passengerCount;

    await this.tripRepository.save(trip);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.tripRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Trip with id:${id} not found.`);
    }
  }

  private async resolveRelations(payload: TripPayload): Promise<[Route, Vehicle, Driver]> {
    const [route, vehicle, driver] = await Promise.all([
      this.routeRepository.findOne(payload.routeId),
      this.vehicleRepository.findOne(payload.vehicleId),
      this.driverRepository.findOne(payload.driverId),
    ]);

    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }
    if (!vehicle) {
      throw new CustomError(404, 'General', `Vehicle with id:${payload.vehicleId} not found.`);
    }
    if (!driver) {
      throw new CustomError(404, 'General', `Driver with id:${payload.driverId} not found.`);
    }

    return [route, vehicle, driver];
  }
}
