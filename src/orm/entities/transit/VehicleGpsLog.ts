import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Vehicle } from './Vehicle';

@Entity({ name: 'vehicle_gps_logs' })
export class VehicleGpsLog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.gpsLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitude: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitude: string;

  @Column({ name: 'captured_at', type: 'timestamp without time zone', default: () => 'now()' })
  capturedAt: Date;
}
