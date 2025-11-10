import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { DriverAssignment } from './DriverAssignment';
import { Route } from './Route';
import { TransportType } from './TransportType';
import { Trip } from './Trip';
import { VehicleGpsLog } from './VehicleGpsLog';

@Unique('vehicles_board_number_unique', ['boardNumber'])
@Check('vehicles_capacity_positive', '"capacity" > 0')
@Entity({ name: 'vehicles' })
export class Vehicle {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'board_number', type: 'text' })
  boardNumber: string;

  @ManyToOne(() => TransportType, (transportType) => transportType.vehicles)
  @JoinColumn({ name: 'transport_type_id' })
  transportType: TransportType;

  @Column({ type: 'integer' })
  capacity: number;

  @ManyToOne(() => Route, (route) => route.vehicles)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @OneToMany(() => DriverAssignment, (assignment) => assignment.vehicle)
  assignments?: DriverAssignment[];

  @OneToMany(() => VehicleGpsLog, (log) => log.vehicle)
  gpsLogs?: VehicleGpsLog[];

  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips?: Trip[];
}
