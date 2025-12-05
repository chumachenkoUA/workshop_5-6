import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Driver } from './Driver';
import { Vehicle } from './Vehicle';

@Unique('driver_assignments_unique', ['driver', 'vehicle', 'assignedAt'])
@Entity({ name: 'driver_assignments' })
export class DriverAssignment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Driver, (driver) => driver.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ name: 'assigned_at', type: 'timestamp without time zone', default: () => 'now()' })
  assignedAt: Date;
}
