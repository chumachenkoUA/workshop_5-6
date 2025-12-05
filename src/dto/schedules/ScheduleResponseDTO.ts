import { Schedule } from 'orm/entities/transit/Schedule';

type RoutePreview = {
  id: string;
  number: string;
  direction: string;
  transportType: {
    id: string;
    name: string;
  } | null;
} | null;

export class ScheduleResponseDTO {
  id: string;
  workdayStart: string;
  workdayEnd: string;
  intervalMinutes: number;
  route: RoutePreview;

  constructor(schedule: Schedule) {
    this.id = schedule.id;
    this.workdayStart = schedule.workdayStart;
    this.workdayEnd = schedule.workdayEnd;
    this.intervalMinutes = schedule.intervalMinutes;
    this.route = schedule.route
      ? {
          id: schedule.route.id,
          number: schedule.route.number,
          direction: schedule.route.direction,
          transportType: schedule.route.transportType
            ? {
                id: schedule.route.transportType.id,
                name: schedule.route.transportType.name,
              }
            : null,
        }
      : null;
  }
}
