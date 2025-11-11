import { Route } from 'orm/entities/transit/Route';

const serializeRouteStop = (routeStop: Route['routeStops'][number]) => ({
  id: routeStop.id,
  stop: routeStop.stop
    ? {
        id: routeStop.stop.id,
        name: routeStop.stop.name,
        latitude: routeStop.stop.latitude,
        longitude: routeStop.stop.longitude,
      }
    : null,
  previousStopId: routeStop.previousStop?.id ?? null,
  nextStopId: routeStop.nextStop?.id ?? null,
});

const serializeRoutePoint = (routePoint: Route['routePoints'][number]) => ({
  id: routePoint.id,
  latitude: routePoint.latitude,
  longitude: routePoint.longitude,
  previousPointId: routePoint.previousPoint?.id ?? null,
  nextPointId: routePoint.nextPoint?.id ?? null,
});

export const serializeRoute = (route: Route) => {
  return {
    id: route.id,
    number: route.number,
    direction: route.direction,
    active: route.active,
    transportType: route.transportType
      ? {
          id: route.transportType.id,
          name: route.transportType.name,
        }
      : null,
    routeStops: route.routeStops ? route.routeStops.map(serializeRouteStop) : [],
    routePoints: route.routePoints ? route.routePoints.map(serializeRoutePoint) : [],
    vehicles: route.vehicles
      ? route.vehicles.map((vehicle) => ({
          id: vehicle.id,
          boardNumber: vehicle.boardNumber,
          capacity: vehicle.capacity,
          transportType: vehicle.transportType
            ? {
                id: vehicle.transportType.id,
                name: vehicle.transportType.name,
              }
            : null,
        }))
      : [],
    schedule: route.schedule
      ? {
          id: route.schedule.id,
          workdayStart: route.schedule.workdayStart,
          workdayEnd: route.schedule.workdayEnd,
          intervalMinutes: route.schedule.intervalMinutes,
        }
      : null,
  };
};
