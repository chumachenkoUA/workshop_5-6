import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Complaint } from './Complaint';
import { Fine } from './Fine';
import { TransportCard } from './TransportCard';
import { UserGpsLog } from './UserGpsLog';

@Unique('transit_users_email_unique', ['email'])
@Unique('transit_users_phone_unique', ['phone'])
@Entity({ name: 'transit_users' })
export class TransitUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ name: 'full_name', type: 'text' })
  fullName: string;

  @Column({ name: 'registered_at', type: 'timestamp without time zone', default: () => 'now()' })
  registeredAt: Date;

  @OneToMany(() => UserGpsLog, (log) => log.user)
  gpsLogs?: UserGpsLog[];

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints?: Complaint[];

  @OneToMany(() => Fine, (fine) => fine.user)
  fines?: Fine[];

  @OneToOne(() => TransportCard, (card) => card.user)
  transportCard?: TransportCard;
}
