import { Check, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/User';

import { FineAppeal } from './FineAppeal';
import { Trip } from './Trip';

@Check('fines_status_check', "\"status\" IN ('В процесі','Оплачено','Відмінено','Просрочено')")
@Entity({ name: 'fines' })
export class Fine {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => User, (user) => user.fines)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  status: string;

  @ManyToOne(() => Trip, (trip) => trip.fines)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column({ name: 'issued_at', type: 'timestamp without time zone', default: () => 'now()' })
  issuedAt: Date;

  @OneToOne(() => FineAppeal, (appeal) => appeal.fine)
  appeal?: FineAppeal;
}
