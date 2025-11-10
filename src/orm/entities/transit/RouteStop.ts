import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Route } from './Route';
import { Stop } from './Stop';

@Unique('route_stops_route_stop_unique', ['route', 'stop'])
@Unique('route_stops_previous_unique', ['previousStop'])
@Unique('route_stops_next_unique', ['nextStop'])
@Entity({ name: 'route_stops' })
export class RouteStop {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Route, (route) => route.routeStops, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @ManyToOne(() => Stop, (stop) => stop.routeStops)
  @JoinColumn({ name: 'stop_id' })
  stop: Stop;

  @OneToOne(() => RouteStop, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'previous_route_stop_id' })
  previousStop?: RouteStop;

  @OneToOne(() => RouteStop, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'next_route_stop_id' })
  nextStop?: RouteStop;
}
