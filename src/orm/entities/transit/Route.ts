import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { RoutePoint } from './RoutePoint';
import { RouteStop } from './RouteStop';
import { Schedule } from './Schedule';
import { TransportType } from './TransportType';
import { Trip } from './Trip';
import { Vehicle } from './Vehicle';

@Check('routes_direction_check', "\"direction\" IN ('прямий','зворотній')")
@Unique('routes_type_number_direction_unique', ['transportType', 'number', 'direction'])
@Entity({ name: 'routes' })
export class Route {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => TransportType, (transportType) => transportType.routes)
  @JoinColumn({ name: 'transport_type_id' })
  transportType: TransportType;

  @Column({ type: 'text' })
  number: string;

  @Column({ type: 'text' })
  direction: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => RouteStop, (routeStop) => routeStop.route)
  routeStops?: RouteStop[];

  @OneToMany(() => RoutePoint, (routePoint) => routePoint.route)
  routePoints?: RoutePoint[];

  @OneToMany(() => Trip, (trip) => trip.route)
  trips?: Trip[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.route)
  vehicles?: Vehicle[];

  @OneToOne(() => Schedule, (schedule) => schedule.route)
  schedule?: Schedule;
}
