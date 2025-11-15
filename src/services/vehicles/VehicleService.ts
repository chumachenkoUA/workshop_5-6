import { getRepository } from 'typeorm';

import { Route } from 'orm/entities/transit/Route';
import { TransportType } from 'orm/entities/transit/TransportType';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['transportType', 'route'];

type VehiclePayload = {
  boardNumber: string;
  capacity: number;
  transportTypeId: string;
  routeId: string;
};

export class VehicleService {
  private vehicleRepository = getRepository(Vehicle);
  private transportTypeRepository = getRepository(TransportType);
  private routeRepository = getRepository(Route);

  public async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne(id, { relations: RELATIONS });
    if (!vehicle) {
      throw new CustomError(404, 'General', `Vehicle with id:${id} not found.`);
    }
    return vehicle;
  }

  public async create(payload: VehiclePayload): Promise<Vehicle> {
    const [transportType, route] = await Promise.all([
      this.transportTypeRepository.findOne(payload.transportTypeId),
      this.routeRepository.findOne(payload.routeId),
    ]);

    if (!transportType) {
      throw new CustomError(404, 'General', `Transport type with id:${payload.transportTypeId} not found.`);
    }

    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    const vehicle = this.vehicleRepository.create({
      boardNumber: payload.boardNumber,
      capacity: payload.capacity,
      transportType,
      route,
    });

    const saved = await this.vehicleRepository.save(vehicle);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: VehiclePayload): Promise<Vehicle> {
    const vehicle = await this.findOneOrFail(id);
    const [transportType, route] = await Promise.all([
      this.transportTypeRepository.findOne(payload.transportTypeId),
      this.routeRepository.findOne(payload.routeId),
    ]);

    if (!transportType) {
      throw new CustomError(404, 'General', `Transport type with id:${payload.transportTypeId} not found.`);
    }

    if (!route) {
      throw new CustomError(404, 'General', `Route with id:${payload.routeId} not found.`);
    }

    vehicle.boardNumber = payload.boardNumber;
    vehicle.capacity = payload.capacity;
    vehicle.transportType = transportType;
    vehicle.route = route;

    await this.vehicleRepository.save(vehicle);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.vehicleRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Vehicle with id:${id} not found.`);
    }
  }
}
