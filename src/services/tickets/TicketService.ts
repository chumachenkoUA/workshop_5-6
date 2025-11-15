import { getRepository } from 'typeorm';

import { Ticket } from 'orm/entities/transit/Ticket';
import { TransportCard } from 'orm/entities/transit/TransportCard';
import { Trip } from 'orm/entities/transit/Trip';
import { CustomError } from 'utils/response/custom-error/CustomError';

const RELATIONS = [
  'trip',
  'trip.route',
  'trip.route.transportType',
  'trip.vehicle',
  'trip.driver',
  'card',
  'card.user',
];

type TicketPayload = {
  tripId: string;
  cardId: string;
  price: string;
};

export class TicketService {
  private ticketRepository = getRepository(Ticket);
  private tripRepository = getRepository(Trip);
  private cardRepository = getRepository(TransportCard);

  public async findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      relations: RELATIONS,
      order: { purchasedAt: 'DESC' },
    });
  }

  public async findOneOrFail(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne(id, { relations: RELATIONS });
    if (!ticket) {
      throw new CustomError(404, 'General', `Ticket with id:${id} not found.`);
    }
    return ticket;
  }

  public async create(payload: TicketPayload): Promise<Ticket> {
    const [trip, card] = await Promise.all([
      this.tripRepository.findOne(payload.tripId, { relations: ['route', 'route.transportType', 'vehicle', 'driver'] }),
      this.cardRepository.findOne(payload.cardId, { relations: ['user'] }),
    ]);

    if (!trip) {
      throw new CustomError(404, 'General', `Trip with id:${payload.tripId} not found.`);
    }

    if (!card) {
      throw new CustomError(404, 'General', `Transport card with id:${payload.cardId} not found.`);
    }

    const ticket = this.ticketRepository.create({
      trip,
      card,
      price: payload.price,
    });

    const saved = await this.ticketRepository.save(ticket);
    return this.findOneOrFail(saved.id);
  }

  public async update(id: string, payload: TicketPayload): Promise<Ticket> {
    const ticket = await this.findOneOrFail(id);
    const [trip, card] = await Promise.all([
      this.tripRepository.findOne(payload.tripId, { relations: ['route', 'route.transportType', 'vehicle', 'driver'] }),
      this.cardRepository.findOne(payload.cardId, { relations: ['user'] }),
    ]);

    if (!trip) {
      throw new CustomError(404, 'General', `Trip with id:${payload.tripId} not found.`);
    }

    if (!card) {
      throw new CustomError(404, 'General', `Transport card with id:${payload.cardId} not found.`);
    }

    ticket.trip = trip;
    ticket.card = card;
    ticket.price = payload.price;

    await this.ticketRepository.save(ticket);
    return this.findOneOrFail(id);
  }

  public async delete(id: string): Promise<void> {
    const deleteResult = await this.ticketRepository.delete(id);
    if (!deleteResult.affected) {
      throw new CustomError(404, 'General', `Ticket with id:${id} not found.`);
    }
  }
}
