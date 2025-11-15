import { Stop } from 'orm/entities/transit/Stop';

type RouteStopPreview = {
  id: string;
  route: {
    id: string;
    number: string;
    direction: string;
    transportType: {
      id: string;
      name: string;
    } | null;
  } | null;
};

export class StopResponseDTO {
  id: string;
  name: string;
  latitude: string;
  longitude: string;
  routeStops: RouteStopPreview[];

  constructor(stop: Stop) {
    this.id = stop.id;
    this.name = stop.name;
    this.latitude = stop.latitude;
    this.longitude = stop.longitude;
    this.routeStops =
      stop.routeStops?.map((routeStop) => ({
        id: routeStop.id,
        route: routeStop.route
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
          : null,
      })) ?? [];
  }
}
