import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { RouteStop } from './RouteStop';

@Unique('stops_name_coordinates_unique', ['name', 'longitude', 'latitude'])
@Entity({ name: 'stops' })
export class Stop {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitude: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitude: string;

  @OneToMany(() => RouteStop, (routeStop) => routeStop.stop)
  routeStops?: RouteStop[];
}
