import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';

export class UserGpsLogResponseDTO {
  id: string;
  latitude: string;
  longitude: string;
  capturedAt: Date;
  user: {
    id: number;
    fullName: string;
  } | null;

  constructor(log: UserGpsLog) {
    this.id = log.id;
    this.latitude = log.latitude;
    this.longitude = log.longitude;
    this.capturedAt = log.capturedAt;
    this.user = log.user
      ? {
          id: log.user.id,
          fullName: log.user.fullName,
        }
      : null;
  }
}
