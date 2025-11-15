import { Route } from 'orm/entities/transit/Route';

type TransportTypePreview = {
  id: string;
  name: string;
} | null;

type RouteStopPreview = {
  id: string;
  stop: {
    id: string;
    name: string;
    latitude: string;
    longitude: string;
  } | null;
  previousStopId: string | null;
  nextStopId: string | null;
};

type RoutePointPreview = {
  id: string;
  latitude: string;
  longitude: string;
  previousPointId: string | null;
  nextPointId: string | null;
};

type VehiclePreview = {
  id: string;
  boardNumber: string;
  capacity: number;
  transportType: TransportTypePreview;
};

type SchedulePreview = {
  id: string;
  workdayStart: string;
  workdayEnd: string;
  intervalMinutes: number;
} | null;

export class RouteResponseDTO {
  id: string;
  number: string;
  direction: string;
  active: boolean;
  transportType: TransportTypePreview;
  routeStops: RouteStopPreview[];
  routePoints: RoutePointPreview[];
  vehicles: VehiclePreview[];
  schedule: SchedulePreview;

  constructor(route: Route) {
    this.id = route.id;
    this.number = route.number;
    this.direction = route.direction;
    this.active = route.active;
    this.transportType = route.transportType
      ? {
          id: route.transportType.id,
          name: route.transportType.name,
        }
      : null;
    this.routeStops =
      route.routeStops?.map((routeStop) => ({
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
      })) ?? [];
    this.routePoints =
      route.routePoints?.map((routePoint) => ({
        id: routePoint.id,
        latitude: routePoint.latitude,
        longitude: routePoint.longitude,
        previousPointId: routePoint.previousPoint?.id ?? null,
        nextPointId: routePoint.nextPoint?.id ?? null,
      })) ?? [];
    this.vehicles =
      route.vehicles?.map((vehicle) => ({
        id: vehicle.id,
        boardNumber: vehicle.boardNumber,
        capacity: vehicle.capacity,
        transportType: vehicle.transportType
          ? {
              id: vehicle.transportType.id,
              name: vehicle.transportType.name,
            }
          : null,
      })) ?? [];
    this.schedule = route.schedule
      ? {
          id: route.schedule.id,
          workdayStart: route.schedule.workdayStart,
          workdayEnd: route.schedule.workdayEnd,
          intervalMinutes: route.schedule.intervalMinutes,
        }
      : null;
  }
}
