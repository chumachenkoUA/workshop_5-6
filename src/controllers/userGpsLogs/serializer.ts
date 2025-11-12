import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';

export const serializeUserGpsLog = (log: UserGpsLog) => {
  return {
    id: log.id,
    latitude: log.latitude,
    longitude: log.longitude,
    capturedAt: log.capturedAt,
    user: log.user
      ? {
          id: log.user.id,
          fullName: log.user.fullName,
        }
      : null,
  };
};
