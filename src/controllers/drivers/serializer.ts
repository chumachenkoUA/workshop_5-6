import { Driver } from 'orm/entities/transit/Driver';

export const serializeDriver = (driver: Driver) => {
  const trips = driver.trips ?? [];

  return {
    id: driver.id,
    email: driver.email,
    phone: driver.phone,
    fullName: driver.fullName,
    licenseData: driver.licenseData,
    passportData: driver.passportData,
    trips: trips.map((trip) => ({
      id: trip.id,
      startedAt: trip.startedAt,
      endedAt: trip.endedAt,
      passengerCount: trip.passengerCount,
      route: trip.route
        ? {
            id: trip.route.id,
            number: trip.route.number,
            direction: trip.route.direction,
          }
        : null,
      vehicle: trip.vehicle
        ? {
            id: trip.vehicle.id,
            boardNumber: trip.vehicle.boardNumber,
          }
        : null,
    })),
  };
};
