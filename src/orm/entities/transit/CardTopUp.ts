import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TransportCard } from './TransportCard';

@Check('card_top_ups_positive_amount', '"amount" > 0')
@Entity({ name: 'card_top_ups' })
export class CardTopUp {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => TransportCard, (card) => card.topUps)
  @JoinColumn({ name: 'card_id' })
  card: TransportCard;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: string;

  @Column({ name: 'recharged_at', type: 'timestamp without time zone', default: () => 'now()' })
  rechargedAt: Date;
}
