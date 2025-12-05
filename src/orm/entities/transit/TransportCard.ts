import { Check, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { User } from '../users/User';

import { CardTopUp } from './CardTopUp';
import { Ticket } from './Ticket';

@Unique('transport_cards_number_unique', ['number'])
@Unique('transport_cards_user_unique', ['user'])
@Check('transport_cards_balance_non_negative', '"balance" >= 0')
@Entity({ name: 'transport_cards' })
export class TransportCard {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToOne(() => User, (user) => user.transportCard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: () => '0' })
  balance: string;

  @Column({ type: 'text' })
  number: string;

  @OneToMany(() => Ticket, (ticket) => ticket.card)
  tickets?: Ticket[];

  @OneToMany(() => CardTopUp, (topUp) => topUp.card)
  topUps?: CardTopUp[];
}
