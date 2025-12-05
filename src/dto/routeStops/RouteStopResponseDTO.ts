import { RouteStop } from 'orm/entities/transit/RouteStop';

type StopPreview = {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
} | null;

type RoutePreview = {
  id: string;
  number: string;
  direction: string;
  transportType: {
    id: string;
    name: string;
  } | null;
} | null;

export class RouteStopResponseDTO {
  id: string;
  stop: StopPreview;
  previousStopId: string | null;
  nextStopId: string | null;
  route: RoutePreview;

  constructor(routeStop: RouteStop) {
    this.id = routeStop.id;
    this.stop = routeStop.stop
      ? {
          id: routeStop.stop.id,
          name: routeStop.stop.name,
          latitude: routeStop.stop.latitude,
          longitude: routeStop.stop.longitude,
        }
      : null;
    this.previousStopId = routeStop.previousStop?.id ?? null;
    this.nextStopId = routeStop.nextStop?.id ?? null;
    this.route = routeStop.route
      ? {
          id: routeStop.route.id,
          number: routeStop.route.number,
          direction: routeStop.route.direction,
          transportType: routeStop.route.transportType
            ? {
                id: routeStop.route.transportType.id,
                name: routeStop.route.transportType.name,
              }
            : null,
        }
      : null;
  }
}
