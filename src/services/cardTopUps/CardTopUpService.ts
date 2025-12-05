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

  public async findMine(userId: number): Promise<CardTopUp[]> {
    const card = await this.transportCardRepository.findOne({
      where: { user: { id: Number(userId), role: 'TRANSIT' } },
      relations: ['user'],
    });

    if (!card) {
      throw new CustomError(404, 'General', `Transport card for user id:${userId} not found.`);
    }

    return this.cardTopUpRepository.find({
      where: { card: { id: card.id } },
      relations: RELATIONS,
      order: { rechargedAt: 'DESC' },
    });
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
    await this.adjustBalance(card, this.toNumber(payload.amount));
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: UpdatePayload): Promise<CardTopUp> {
    const topUp = await this.findOneOrFail(id);
    const oldAmount = this.toNumber(topUp.amount);
    const newAmount = this.toNumber(payload.amount);
    const delta = newAmount - oldAmount;

    topUp.amount = payload.amount;
    await this.cardTopUpRepository.save(topUp);
    await this.adjustBalance(topUp.card, delta);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const topUp = await this.findOneOrFail(id);
    await this.adjustBalance(topUp.card, -this.toNumber(topUp.amount));
    const deleteResult = await this.cardTopUpRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Card top-up with id:${id} not found.`);
    }
  }

  private toNumber(amount: string): number {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed)) {
      throw new CustomError(400, 'General', 'Amount is invalid.');
    }
    return parsed;
  }

  private async adjustBalance(card: TransportCard, delta: number): Promise<void> {
    const current = this.toNumber(card.balance);
    const next = Number((current + delta).toFixed(2));

    if (next < 0) {
      throw new CustomError(409, 'General', 'Balance cannot become negative.');
    }

    card.balance = next.toFixed(2);
    await this.transportCardRepository.save(card);
  }
}
