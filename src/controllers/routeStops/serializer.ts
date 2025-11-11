import { RouteStop } from 'orm/entities/transit/RouteStop';

const serializeStopInfo = (stop: RouteStop['stop']) =>
  stop
    ? {
        id: stop.id,
        name: stop.name,
        latitude: stop.latitude,
        longitude: stop.longitude,
      }
    : null;

export const serializeRouteStop = (routeStop: RouteStop) => {
  const route = routeStop.route;
  const transportType = route?.transportType;

  return {
    id: routeStop.id,
    stop: serializeStopInfo(routeStop.stop),
    previousStopId: routeStop.previousStop?.id ?? null,
    nextStopId: routeStop.nextStop?.id ?? null,
    route: route
      ? {
          id: route.id,
          number: route.number,
          direction: route.direction,
          transportType: transportType
            ? {
                id: transportType.id,
                name: transportType.name,
              }
            : null,
        }
      : null,
  };
};
