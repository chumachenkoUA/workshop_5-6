import { getRepository } from 'typeorm';

import { Driver } from 'orm/entities/transit/Driver';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['trips', 'trips.route', 'trips.vehicle'];

type PassportData = Record<string, unknown>;

type DriverPayload = {
  email: string;
  phone: string;
  fullName: string;
  licenseData: string;
  passportData: PassportData;
};

export class DriverService {
  private driverRepository = getRepository(Driver);

  public async findAll(): Promise<Driver[]> {
    return this.driverRepository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne(id, { relations: RELATIONS });
    if (!driver) {
      throw new CustomError(404, 'General', `Driver with id:${id} not found.`);
    }
    return driver;
  }

  public async create(payload: DriverPayload): Promise<Driver> {
    const driver = this.driverRepository.create(payload);
    const saved = await this.driverRepository.save(driver);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: DriverPayload): Promise<Driver> {
    const driver = await this.findOneOrFail(id);

    driver.email = payload.email;
    driver.phone = payload.phone;
    driver.fullName = payload.fullName;
    driver.licenseData = payload.licenseData;
    driver.passportData = payload.passportData;

    await this.driverRepository.save(driver);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.driverRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Driver with id:${id} not found.`);
    }
  }
}
