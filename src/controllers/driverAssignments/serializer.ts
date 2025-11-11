import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';

export const serializeDriverAssignment = (assignment: DriverAssignment) => {
  const driver = assignment.driver;
  const vehicle = assignment.vehicle;
  const route = vehicle?.route;

  return {
    id: assignment.id,
    driverId: driver?.id ?? null,
    vehicleId: vehicle?.id ?? null,
    assignedAt: assignment.assignedAt,
    driver: driver
      ? {
          id: driver.id,
          fullName: driver.fullName,
          phone: driver.phone,
          email: driver.email,
        }
      : null,
    vehicle: vehicle
      ? {
          id: vehicle.id,
          boardNumber: vehicle.boardNumber,
          route: route
            ? {
                id: route.id,
                number: route.number,
                direction: route.direction,
              }
            : null,
        }
      : null,
  };
};
