import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Route } from './Route';

@Unique('route_points_coordinates_unique', ['route', 'longitude', 'latitude'])
@Unique('route_points_previous_unique', ['previousPoint'])
@Unique('route_points_next_unique', ['nextPoint'])
@Entity({ name: 'route_points' })
export class RoutePoint {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @ManyToOne(() => Route, (route) => route.routePoints, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'route_id' })
  route: Route;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitude: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitude: string;

  @OneToOne(() => RoutePoint, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'previous_route_point_id' })
  previousPoint?: RoutePoint;

  @OneToOne(() => RoutePoint, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'next_route_point_id' })
  nextPoint?: RoutePoint;
}
