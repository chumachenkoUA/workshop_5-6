import { getRepository } from 'typeorm';

import { Complaint } from 'orm/entities/transit/Complaint';
import { Trip } from 'orm/entities/transit/Trip';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = ['user', 'trip', 'trip.route', 'trip.driver'];

type CreateComplaintPayload = {
  userId: string;
  tripId: string;
  type: string;
  message: string;
  status: string;
};

type UpdateComplaintPayload = CreateComplaintPayload;

export class ComplaintService {
  private complaintRepository = getRepository(Complaint);
  private userRepository = getRepository(User);
  private tripRepository = getRepository(Trip);

  public async findAll(): Promise<Complaint[]> {
    return this.complaintRepository.find({
      relations: RELATIONS,
      order: { id: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne(id, { relations: RELATIONS });
    if (!complaint) {
      throw new CustomError(404, 'General', `Complaint with id:${id} not found.`);
    }
    return complaint;
  }

  public async create(payload: CreateComplaintPayload): Promise<Complaint> {
    const [user, trip] = await Promise.all([
      this.loadTransitUser(payload.userId),
      this.tripRepository.findOne(payload.tripId, { relations: ['route', 'driver'] }),
    ]);

    if (!trip) {
      throw new CustomError(404, 'General', `Trip with id:${payload.tripId} not found.`);
    }

    const complaint = this.complaintRepository.create({
      user,
      trip,
      type: payload.type,
      message: payload.message,
      status: payload.status,
    });

    const saved = await this.complaintRepository.save(complaint);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: UpdateComplaintPayload): Promise<Complaint> {
    const complaint = await this.findOneOrFail(id);

    const [user, trip] = await Promise.all([
      this.loadTransitUser(payload.userId),
      this.tripRepository.findOne(payload.tripId, { relations: ['route', 'driver'] }),
    ]);

    if (!trip) {
      throw new CustomError(404, 'General', `Trip with id:${payload.tripId} not found.`);
    }

    complaint.user = user;
    complaint.trip = trip;
    complaint.type = payload.type;
    complaint.message = payload.message;
    complaint.status = payload.status;

    await this.complaintRepository.save(complaint);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.complaintRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Complaint with id:${id} not found.`);
    }
  }

  private async loadTransitUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: Number(id), role: 'TRANSIT' } });
    if (!user) {
      throw new CustomError(404, 'General', `Transit user with id:${id} not found.`);
    }
    return user;
  }
}
