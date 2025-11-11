import { RoutePoint } from 'orm/entities/transit/RoutePoint';

export const serializeRoutePoint = (point: RoutePoint) => {
  const route = point.route;
  const transportType = route?.transportType;

  return {
    id: point.id,
    latitude: point.latitude,
    longitude: point.longitude,
    previousPointId: point.previousPoint?.id ?? null,
    nextPointId: point.nextPoint?.id ?? null,
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
