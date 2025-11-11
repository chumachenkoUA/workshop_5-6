import { Stop } from 'orm/entities/transit/Stop';

export const serializeStop = (stop: Stop) => {
  return {
    id: stop.id,
    name: stop.name,
    latitude: stop.latitude,
    longitude: stop.longitude,
    routeStops: stop.routeStops
      ? stop.routeStops.map((routeStop) => ({
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
        }))
      : [],
  };
};
