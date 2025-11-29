import { getRepository } from 'typeorm';

import { Fine } from 'orm/entities/transit/Fine';
import { Trip } from 'orm/entities/transit/Trip';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['user', 'trip', 'trip.route', 'appeal'];

type FinePayload = {
  userId: string;
  tripId: string;
  status: string;
};

export class FineService {
  private fineRepository = getRepository(Fine);
  private userRepository = getRepository(User);
  private tripRepository = getRepository(Trip);

  public async findAll(): Promise<Fine[]> {
    return this.fineRepository.find({
      relations: RELATIONS,
      order: { issuedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Fine> {
    const fine = await this.fineRepository.findOne(id, { relations: RELATIONS });
    if (!fine) {
      throw new CustomError(404, 'General', `Fine with id:${id} not found.`);
    }
    return fine;
  }

  public async create(payload: FinePayload): Promise<Fine> {
    const [user, trip] = await this.resolveRelations(payload.userId, payload.tripId);

    const fine = this.fineRepository.create({
      user,
      trip,
      status: payload.status,
    });

    const saved = await this.fineRepository.save(fine);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: FinePayload): Promise<Fine> {
    const fine = await this.findOneOrFail(id);
    const [user, trip] = await this.resolveRelations(payload.userId, payload.tripId);

    fine.user = user;
    fine.trip = trip;
    fine.status = payload.status;

    await this.fineRepository.save(fine);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.fineRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Fine with id:${id} not found.`);
    }
  }

  private async resolveRelations(userId: string, tripId: string): Promise<[User, Trip]> {
    const [user, trip] = await Promise.all([
      this.userRepository.findOne({ where: { id: Number(userId), role: 'TRANSIT' } }),
      this.tripRepository.findOne(tripId, { relations: ['route'] }),
    ]);

    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${userId} not found.`);
    }

    if (!trip) {
      throw new CustomError(404, 'General', `Trip with id:${tripId} not found.`);
    }

    return [user, trip];
  }
}
