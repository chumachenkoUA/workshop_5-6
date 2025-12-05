import { getRepository } from 'typeorm';

import { TransportCard } from 'orm/entities/transit/TransportCard';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['user', 'tickets', 'topUps'];

type TransportCardPayload = {
  userId: string;
  number: string;
  balance: string;
};

export class TransportCardService {
  private transportCardRepository = getRepository(TransportCard);
  private userRepository = getRepository(User);

  public async findAll(): Promise<TransportCard[]> {
    return this.transportCardRepository.find({
      relations: RELATIONS,
      order: { id: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<TransportCard> {
    const card = await this.transportCardRepository.findOne(id, { relations: RELATIONS });
    if (!card) {
      throw new CustomError(404, 'General', `Transport card with id:${id} not found.`);
    }
    return card;
  }

  public async findMine(userId: number): Promise<TransportCard> {
    const user = await this.userRepository.findOne({
      where: { id: Number(userId), role: 'TRANSIT' },
      relations: ['transportCard'],
    });

    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
    }

    if (!user.transportCard) {
      throw new CustomError(404, 'General', `Transport card for user id:${userId} not found.`);
    }

    return this.findOneOrFail(user.transportCard.id);
  }

  public async create(payload: TransportCardPayload): Promise<TransportCard> {
    const user = await this.userRepository.findOne({
      where: { id: Number(payload.userId), role: 'TRANSIT' },
      relations: ['transportCard'],
    });

    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${payload.userId} not found.`);
    }

    if (user.transportCard) {
      throw new CustomError(409, 'General', `Transit user with id:${payload.userId} already has a transport card.`);
    }

    const card = this.transportCardRepository.create({
      user,
      number: payload.number,
      balance: payload.balance,
    });

    const saved = await this.transportCardRepository.save(card);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: TransportCardPayload): Promise<TransportCard> {
    const card = await this.findOneOrFail(id);
    const user = await this.userRepository.findOne({
      where: { id: Number(payload.userId), role: 'TRANSIT' },
      relations: ['transportCard'],
    });

    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${payload.userId} not found.`);
    }

    if (user.transportCard && user.transportCard.id !== card.id) {
      throw new CustomError(
        409,
        'General',
        `Transit user with id:${payload.userId} already has another transport card.`,
      );
    }

    card.user = user;
    card.number = payload.number;
    card.balance = payload.balance;

    await this.transportCardRepository.save(card);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.transportCardRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Transport card with id:${id} not found.`);
    }
  }
}
