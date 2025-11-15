import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';
import { Vehicle } from 'orm/entities/transit/Vehicle';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['driver', 'vehicle', 'vehicle.route'];

type CreateDriverAssignmentPayload = {
  driverId: string;
  vehicleId: string;
  assignedAt?: Date;
};

type UpdateDriverAssignmentPayload = CreateDriverAssignmentPayload;

export class DriverAssignmentService {
  private assignmentRepository = getRepository(DriverAssignment);
  private driverRepository = getRepository(Driver);
  private vehicleRepository = getRepository(Vehicle);

  public async findAll(): Promise<DriverAssignment[]> {
    return this.assignmentRepository.find({
      relations: RELATIONS,
      order: { assignedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<DriverAssignment> {
    const assignment = await this.assignmentRepository.findOne(id, { relations: RELATIONS });
    if (!assignment) {
      throw new CustomError(404, 'General', `Driver assignment with id:${id} not found.`);
    }
    return assignment;
  }

  public async create(payload: CreateDriverAssignmentPayload): Promise<DriverAssignment> {
    const [driver, vehicle] = await Promise.all([
      this.driverRepository.findOne(payload.driverId),
      this.vehicleRepository.findOne(payload.vehicleId, { relations: ['route'] }),
    ]);

    if (!driver) {
      throw new CustomError(404, 'General', `Driver with id:${payload.driverId} not found.`);
    }
    if (!vehicle) {
      throw new CustomError(404, 'General', `Vehicle with id:${payload.vehicleId} not found.`);
    }

    const assignment = this.assignmentRepository.create({
      driver,
      vehicle,
      assignedAt: payload.assignedAt ?? new Date(),
    });

    const saved = await this.assignmentRepository.save(assignment);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: UpdateDriverAssignmentPayload): Promise<DriverAssignment> {
    const assignment = await this.findOneOrFail(id);

    const [driver, vehicle] = await Promise.all([
      this.driverRepository.findOne(payload.driverId),
      this.vehicleRepository.findOne(payload.vehicleId, { relations: ['route'] }),
    ]);

    if (!driver) {
      throw new CustomError(404, 'General', `Driver with id:${payload.driverId} not found.`);
    }
    if (!vehicle) {
      throw new CustomError(404, 'General', `Vehicle with id:${payload.vehicleId} not found.`);
    }

    assignment.driver = driver;
    assignment.vehicle = vehicle;
    assignment.assignedAt = payload.assignedAt ?? assignment.assignedAt;

    await this.assignmentRepository.save(assignment);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.assignmentRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Driver assignment with id:${id} not found.`);
    }
  }
}
