import { Trip } from 'orm/entities/transit/Trip';

export const serializeTrip = (trip: Trip) => {
  return {
    id: trip.id,
    startedAt: trip.startedAt,
    endedAt: trip.endedAt,
    passengerCount: trip.passengerCount,
    route: trip.route
      ? {
          id: trip.route.id,
          number: trip.route.number,
        }
      : null,
    vehicle: trip.vehicle
      ? {
          id: trip.vehicle.id,
          boardNumber: trip.vehicle.boardNumber,
        }
      : null,
    driver: trip.driver
      ? {
          id: trip.driver.id,
          fullName: trip.driver.fullName,
          email: trip.driver.email,
          phone: trip.driver.phone,
        }
      : null,
  };
};
