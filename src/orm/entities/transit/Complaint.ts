import { Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { TransitUser } from './TransitUser';
import { Trip } from './Trip';

@Check('complaints_status_check', "\"status\" IN ('Подано','Розглядається','Розглянуто')")
@Entity({ name: 'complaints' })
export class Complaint {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => TransitUser, (user) => user.complaints)
  @JoinColumn({ name: 'user_id' })
  user: TransitUser;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  message: string;

  @ManyToOne(() => Trip, (trip) => trip.complaints, { nullable: true })
  @JoinColumn({ name: 'trip_id' })
  trip?: Trip;

  @Column({ type: 'text' })
  status: string;
}
