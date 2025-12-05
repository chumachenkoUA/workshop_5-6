import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { FineAppeal } from 'orm/entities/transit/FineAppeal';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['fine', 'fine.user', 'fine.trip', 'fine.trip.route'];

type FineAppealPayload = {
  fineId: string;
  message: string;
  status: string;
};

export class FineAppealService {
  private appealRepository = getRepository(FineAppeal);
  private fineRepository = getRepository(Fine);

  public async findAll(): Promise<FineAppeal[]> {
    return this.appealRepository.find({
      relations: RELATIONS,
      order: { createdAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<FineAppeal> {
    const appeal = await this.appealRepository.findOne(id, { relations: RELATIONS });
    if (!appeal) {
      throw new CustomError(404, 'General', `Fine appeal with id:${id} not found.`);
    }
    return appeal;
  }

  public async create(payload: FineAppealPayload): Promise<FineAppeal> {
    const fine = await this.loadFine(payload.fineId);
    if (fine.appeal) {
      throw new CustomError(409, 'General', `Fine with id:${payload.fineId} already has an appeal.`);
    }

    const appeal = this.appealRepository.create({
      fine,
      message: payload.message,
      status: payload.status,
    });

    const saved = await this.appealRepository.save(appeal);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: FineAppealPayload): Promise<FineAppeal> {
    const appeal = await this.findOneOrFail(id);
    const fine = await this.loadFine(payload.fineId);

    if (fine.appeal && fine.appeal.id !== appeal.id) {
      throw new CustomError(409, 'General', `Fine with id:${payload.fineId} already has another appeal.`);
    }

    appeal.fine = fine;
    appeal.message = payload.message;
    appeal.status = payload.status;

    await this.appealRepository.save(appeal);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.appealRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Fine appeal with id:${id} not found.`);
    }
  }

  private async loadFine(fineId: string): Promise<Fine> {
    const fine = await this.fineRepository.findOne(fineId, {
      relations: ['user', 'trip', 'trip.route', 'appeal'],
    });
    if (!fine) {
      throw new CustomError(404, 'General', `Fine with id:${fineId} not found.`);
    }
    return fine;
  }
}
