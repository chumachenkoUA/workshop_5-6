import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/User';

@Entity({ name: 'user_gps_logs' })
export class UserGpsLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => User, (user) => user.gpsLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitude: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitude: string;

  @Column({ name: 'captured_at', type: 'timestamp without time zone', default: () => 'now()' })
  capturedAt: Date;
}
