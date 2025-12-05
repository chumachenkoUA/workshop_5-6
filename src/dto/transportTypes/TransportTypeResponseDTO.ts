import { TransportType } from 'orm/entities/transit/TransportType';

type VehiclePreview = {
  id: string;
  boardNumber: string;
  capacity: number;
};

export class TransportTypeResponseDTO {
  id: string;
  name: string;
  vehicles: VehiclePreview[];

  constructor(transportType: TransportType) {
    this.id = transportType.id;
    this.name = transportType.name;
    this.vehicles =
      transportType.vehicles?.map((vehicle) => ({
        id: vehicle.id,
        boardNumber: vehicle.boardNumber,
        capacity: vehicle.capacity,
      })) ?? [];
  }
}
