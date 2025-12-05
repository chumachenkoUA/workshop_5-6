import { DriverAssignment } from 'orm/entities/transit/DriverAssignment';

export class DriverAssignmentResponseDTO {
  id: string;
  driverId: string | null;
  vehicleId: string | null;
  assignedAt: Date;
  driver: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  } | null;
  vehicle: {
    id: string;
    boardNumber: string;
    route: {
      id: string;
      number: string;
      direction: string;
    } | null;
  } | null;

  constructor(assignment: DriverAssignment) {
    this.id = assignment.id;
    this.driverId = assignment.driver?.id ?? null;
    this.vehicleId = assignment.vehicle?.id ?? null;
    this.assignedAt = assignment.assignedAt;
    this.driver = assignment.driver
      ? {
          id: assignment.driver.id,
          fullName: assignment.driver.fullName,
          phone: assignment.driver.phone,
          email: assignment.driver.email,
        }
      : null;
    this.vehicle = assignment.vehicle
      ? {
          id: assignment.vehicle.id,
          boardNumber: assignment.vehicle.boardNumber,
          route: assignment.vehicle.route
            ? {
                id: assignment.vehicle.route.id,
                number: assignment.vehicle.route.number,
                direction: assignment.vehicle.route.direction,
              }
            : null,
        }
      : null;
  }
}
