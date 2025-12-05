import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Route } from './Route';
import { Vehicle } from './Vehicle';

@Unique('transport_types_name_unique', ['name'])
@Entity({ name: 'transport_types' })
export class TransportType {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @OneToMany(() => Route, (route) => route.transportType)
  routes?: Route[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.transportType)
  vehicles?: Vehicle[];
}
