import { Driver } from 'orm/entities/transit/Driver';

type TripPreview = {
  id: string;
  startedAt: Date;
  endedAt: Date;
  passengerCount: number;
  route: {
    id: string;
    number: string;
    direction: string;
  } | null;
  vehicle: {
    id: string;
    boardNumber: string;
  } | null;
};

export class DriverResponseDTO {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  licenseData: string;
  passportData: Record<string, unknown>;
  trips: TripPreview[];

  constructor(driver: Driver) {
    this.id = driver.id;
    this.email = driver.email;
    this.phone = driver.phone;
    this.fullName = driver.fullName;
    this.licenseData = driver.licenseData;
    this.passportData = driver.passportData;
    this.trips =
      driver.trips?.map((trip) => ({
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
      })) ?? [];
  }
}
