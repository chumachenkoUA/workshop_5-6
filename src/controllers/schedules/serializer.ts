import { Schedule } from 'orm/entities/transit/Schedule';

export const serializeSchedule = (schedule: Schedule) => {
  const route = schedule.route;
  const transportType = route?.transportType;

  return {
    id: schedule.id,
    workdayStart: schedule.workdayStart,
    workdayEnd: schedule.workdayEnd,
    intervalMinutes: schedule.intervalMinutes,
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
