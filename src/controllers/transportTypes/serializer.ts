import { TransportType } from 'orm/entities/transit/TransportType';

export const serializeTransportType = (type: TransportType) => {
  return {
    id: type.id,
    name: type.name,
    vehicles: type.vehicles
      ? type.vehicles.map((vehicle) => ({
          id: vehicle.id,
          boardNumber: vehicle.boardNumber,
          capacity: vehicle.capacity,
        }))
      : [],
  };
};
