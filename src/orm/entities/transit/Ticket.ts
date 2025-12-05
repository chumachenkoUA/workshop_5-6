import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TransportCard } from './TransportCard';
import { Trip } from './Trip';

@Check('tickets_non_negative_price', '"price" >= 0')
@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Trip, (trip) => trip.tickets)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @ManyToOne(() => TransportCard, (card) => card.tickets)
  @JoinColumn({ name: 'card_id' })
  card: TransportCard;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: string;

  @Column({ name: 'purchased_at', type: 'timestamp without time zone', default: () => 'now()' })
  purchasedAt: Date;
}
