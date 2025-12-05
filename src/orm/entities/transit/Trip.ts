import { Check, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Complaint } from './Complaint';
import { Driver } from './Driver';
import { Fine } from './Fine';
import { Route } from './Route';
import { Ticket } from './Ticket';
import { Vehicle } from './Vehicle';

@Check('trips_duration_positive', '"ended_at" > "started_at"')
@Check('trips_passengers_non_negative', '"passenger_count" >= 0')
@Unique('trips_vehicle_time_unique', ['vehicle', 'startedAt', 'endedAt'])
@Entity({ name: 'trips' })
export class Trip {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Route, (route) => route.trips)
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @ManyToOne(() => Driver, (driver) => driver.trips)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column({ name: 'started_at', type: 'timestamp without time zone' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamp without time zone' })
  endedAt: Date;

  @Column({ name: 'passenger_count', type: 'integer', default: 0 })
  passengerCount: number;

  @OneToMany(() => Ticket, (ticket) => ticket.trip)
  tickets?: Ticket[];

  @OneToMany(() => Complaint, (complaint) => complaint.trip)
  complaints?: Complaint[];

  @OneToMany(() => Fine, (fine) => fine.trip)
  fines?: Fine[];
}
