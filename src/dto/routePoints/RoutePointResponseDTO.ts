import { RoutePoint } from 'orm/entities/transit/RoutePoint';

type RoutePreview = {
  id: string;
  number: string;
  direction: string;
  transportType: {
    id: string;
    name: string;
  } | null;
} | null;

export class RoutePointResponseDTO {
  id: string;
  latitude: string;
  longitude: string;
  previousPointId: string | null;
  nextPointId: string | null;
  route: RoutePreview;

  constructor(point: RoutePoint) {
    this.id = point.id;
    this.latitude = point.latitude;
    this.longitude = point.longitude;
    this.previousPointId = point.previousPoint?.id ?? null;
    this.nextPointId = point.nextPoint?.id ?? null;
    this.route = point.route
      ? {
          id: point.route.id,
          number: point.route.number,
          direction: point.route.direction,
          transportType: point.route.transportType
            ? {
                id: point.route.transportType.id,
                name: point.route.transportType.name,
              }
            : null,
        }
      : null;
  }
}
