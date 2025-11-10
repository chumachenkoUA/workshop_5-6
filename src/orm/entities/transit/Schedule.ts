import { Check, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Route } from './Route';

@Check('schedules_interval_positive', '"interval_minutes" > 0')
@Unique('schedules_route_unique', ['route'])
@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToOne(() => Route, (route) => route.schedule)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column({ name: 'workday_start', type: 'time without time zone' })
  workdayStart: string;

  @Column({ name: 'workday_end', type: 'time without time zone' })
  workdayEnd: string;

  @Column({ name: 'interval_minutes', type: 'integer' })
  intervalMinutes: number;
}
