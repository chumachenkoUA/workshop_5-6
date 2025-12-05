import { Trip } from 'orm/entities/transit/Trip';

export class TripResponseDTO {
  id: string;
  startedAt: Date;
  endedAt: Date;
  passengerCount: number;
  route: {
    id: string;
    number: string;
  } | null;
  vehicle: {
    id: string;
    boardNumber: string;
  } | null;
  driver: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;

  constructor(trip: Trip) {
    this.id = trip.id;
    this.startedAt = trip.startedAt;
    this.endedAt = trip.endedAt;
    this.passengerCount = trip.passengerCount;
    this.route = trip.route
      ? {
          id: trip.route.id,
          number: trip.route.number,
        }
      : null;
    this.vehicle = trip.vehicle
      ? {
          id: trip.vehicle.id,
          boardNumber: trip.vehicle.boardNumber,
        }
      : null;
    this.driver = trip.driver
      ? {
          id: trip.driver.id,
          fullName: trip.driver.fullName,
          email: trip.driver.email,
          phone: trip.driver.phone,
        }
      : null;
  }
}
