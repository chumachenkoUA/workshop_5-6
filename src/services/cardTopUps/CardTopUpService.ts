import { getRepository } from 'typeorm';

import { CardTopUp } from 'orm/entities/transit/CardTopUp';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['card', 'card.user'];

type CreatePayload = {
  cardId: string;
  amount: string;
};

type UpdatePayload = {
  amount: string;
};

export class CardTopUpService {
  private cardTopUpRepository = getRepository(CardTopUp);
  private transportCardRepository = getRepository(TransportCard);

  public async findAll(): Promise<CardTopUp[]> {
    return this.cardTopUpRepository.find({
      relations: RELATIONS,
      order: { rechargedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<CardTopUp> {
    const topUp = await this.cardTopUpRepository.findOne(id, { relations: RELATIONS });
    if (!topUp) {
      throw new CustomError(404, 'General', `Card top-up with id:${id} not found.`);
    }
    return topUp;
  }

  public async create(payload: CreatePayload): Promise<CardTopUp> {
    const card = await this.transportCardRepository.findOne(payload.cardId, { relations: ['user'] });
    if (!card) {
      throw new CustomError(404, 'General', `Transport card with id:${payload.cardId} not found.`);
    }

    const topUp = this.cardTopUpRepository.create({
      card,
      amount: payload.amount,
    });

    const saved = await this.cardTopUpRepository.save(topUp);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: UpdatePayload): Promise<CardTopUp> {
    const topUp = await this.findOneOrFail(id);
    topUp.amount = payload.amount;
    await this.cardTopUpRepository.save(topUp);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.cardTopUpRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Card top-up with id:${id} not found.`);
    }
  }
}
