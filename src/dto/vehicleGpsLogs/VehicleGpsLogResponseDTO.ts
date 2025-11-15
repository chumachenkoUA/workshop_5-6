import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';

export class VehicleGpsLogResponseDTO {
  id: string;
  latitude: string;
  longitude: string;
  capturedAt: Date;
  vehicle: {
    id: string;
    boardNumber: string;
  } | null;

  constructor(log: VehicleGpsLog) {
    this.id = log.id;
    this.latitude = log.latitude;
    this.longitude = log.longitude;
    this.capturedAt = log.capturedAt;
    this.vehicle = log.vehicle
      ? {
          id: log.vehicle.id,
          boardNumber: log.vehicle.boardNumber,
        }
      : null;
  }
}
