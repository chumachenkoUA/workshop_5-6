import { getRepository } from 'typeorm';

import { Vehicle } from 'orm/entities/transit/Vehicle';
import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['vehicle'];

type VehicleGpsLogPayload = {
  vehicleId: string;
  latitude: string;
  longitude: string;
};

export class VehicleGpsLogService {
  private logRepository = getRepository(VehicleGpsLog);
  private vehicleRepository = getRepository(Vehicle);

  public async findAll(): Promise<VehicleGpsLog[]> {
    return this.logRepository.find({
      relations: RELATIONS,
      order: { capturedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<VehicleGpsLog> {
    const log = await this.logRepository.findOne(id, { relations: RELATIONS });
    if (!log) {
      throw new CustomError(404, 'General', `Vehicle GPS log with id:${id} not found.`);
    }
    return log;
  }

  public async create(payload: VehicleGpsLogPayload): Promise<VehicleGpsLog> {
    const log = this.logRepository.create({
      vehicle: await this.loadVehicle(payload.vehicleId),
      latitude: payload.latitude,
      longitude: payload.longitude,
    });

    const saved = await this.logRepository.save(log);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: VehicleGpsLogPayload): Promise<VehicleGpsLog> {
    const log = await this.findOneOrFail(id);
    log.vehicle = await this.loadVehicle(payload.vehicleId);
    log.latitude = payload.latitude;
    log.longitude = payload.longitude;

    await this.logRepository.save(log);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.logRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Vehicle GPS log with id:${id} not found.`);
    }
  }

  private async loadVehicle(vehicleId: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne(vehicleId);
    if (!vehicle) {
      throw new CustomError(404, 'General', `Vehicle with id:${vehicleId} not found.`);
    }
    return vehicle;
  }
}
