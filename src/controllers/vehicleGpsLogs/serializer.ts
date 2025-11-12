import { VehicleGpsLog } from 'orm/entities/transit/VehicleGpsLog';

export const serializeVehicleGpsLog = (log: VehicleGpsLog) => {
  return {
    id: log.id,
    latitude: log.latitude,
    longitude: log.longitude,
    capturedAt: log.capturedAt,
    vehicle: log.vehicle
      ? {
          id: log.vehicle.id,
          boardNumber: log.vehicle.boardNumber,
        }
      : null,
  };
};
