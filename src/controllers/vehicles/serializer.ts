import { Vehicle } from 'orm/entities/transit/Vehicle';

export const serializeVehicle = (vehicle: Vehicle) => {
  return {
    id: vehicle.id,
    boardNumber: vehicle.boardNumber,
    capacity: vehicle.capacity,
    transportType: vehicle.transportType
      ? {
          id: vehicle.transportType.id,
          name: vehicle.transportType.name,
        }
      : null,
    route: vehicle.route
      ? {
          id: vehicle.route.id,
          number: vehicle.route.number,
          direction: vehicle.route.direction,
        }
      : null,
  };
};
