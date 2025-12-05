import { Vehicle } from 'orm/entities/transit/Vehicle';

type TransportTypePreview = {
  id: string;
  name: string;
} | null;

type RoutePreview = {
  id: string;
  number: string;
  direction: string;
} | null;

export class VehicleResponseDTO {
  id: string;
  boardNumber: string;
  capacity: number;
  transportType: TransportTypePreview;
  route: RoutePreview;

  constructor(vehicle: Vehicle) {
    this.id = vehicle.id;
    this.boardNumber = vehicle.boardNumber;
    this.capacity = vehicle.capacity;
    this.transportType = vehicle.transportType
      ? {
          id: vehicle.transportType.id,
          name: vehicle.transportType.name,
        }
      : null;
    this.route = vehicle.route
      ? {
          id: vehicle.route.id,
          number: vehicle.route.number,
          direction: vehicle.route.direction,
        }
      : null;
  }
}
