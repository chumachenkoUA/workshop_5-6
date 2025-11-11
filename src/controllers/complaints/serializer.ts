import { Complaint } from 'orm/entities/transit/Complaint';

export const serializeComplaint = (complaint: Complaint) => {
  const user = complaint.user;
  const trip = complaint.trip;
  const route = trip?.route;
  const driver = trip?.driver;

  return {
    id: complaint.id,
    type: complaint.type,
    status: complaint.status,
    message: complaint.message,
    user: user
      ? {
          id: user.id,
          fullName: user.fullName,
        }
      : null,
    trip: trip
      ? {
          id: trip.id,
          route: route
            ? {
                id: route.id,
                number: route.number,
              }
            : null,
          driver: driver
            ? {
                id: driver.id,
                fullName: driver.fullName,
              }
            : null,
        }
      : null,
  };
};
