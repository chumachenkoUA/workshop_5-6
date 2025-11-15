import { getRepository } from 'typeorm';

import { TransportType } from 'orm/entities/transit/TransportType';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['vehicles'];

type TransportTypePayload = {
  name: string;
};

export class TransportTypeService {
  private repository = getRepository(TransportType);

  public async findAll(): Promise<TransportType[]> {
    return this.repository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  public async findOneOrFail(id: string): Promise<TransportType> {
    const transportType = await this.repository.findOne(id, {
      relations: RELATIONS,
    });

    if (!transportType) {
      throw new CustomError(404, 'General', `Transport type with id:${id} not found.`);
    }

    return transportType;
  }

  public async create(payload: TransportTypePayload): Promise<TransportType> {
    const transportType = this.repository.create({
      name: payload.name,
    });

    const created = await this.repository.save(transportType);
    return this.findOneOrFail(created.id);
  }

  public async update(id: string, payload: TransportTypePayload): Promise<TransportType> {
    const transportType = await this.findOneOrFail(id);

    transportType.name = payload.name;
    await this.repository.save(transportType);

    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.repository.delete(id);

    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Transport type with id:${id} not found.`);
    }
  }
}
