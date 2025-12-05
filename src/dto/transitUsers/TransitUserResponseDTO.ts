import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';
import { User } from 'orm/entities/users/User';

type TransportCardPreview = {
  id: string;
  number: string;
  balance: string;
} | null;

type FinePreview = {
  id: string;
  status: string;
  issuedAt: Date;
};

type ComplaintPreview = {
  id: string;
  type: string;
  status: string;
};

type GpsLogPreview = {
  id: string;
  latitude: string;
  longitude: string;
  capturedAt: Date;
} | null;

export class TransitUserResponseDTO {
  id: number;
  email: string;
  phone: string;
  fullName: string;
  registeredAt: Date;
  transportCard: TransportCardPreview;
  fines: FinePreview[];
  complaints: ComplaintPreview[];
  lastGpsLog: GpsLogPreview;

  constructor(user: User, lastGpsLog: UserGpsLog | null) {
    this.id = user.id;
    this.email = user.email;
    this.phone = user.phone;
    this.fullName = user.fullName;
    this.registeredAt = user.registeredAt;
    this.transportCard = user.transportCard
      ? {
          id: user.transportCard.id,
          number: user.transportCard.number,
          balance: user.transportCard.balance,
        }
      : null;
    this.fines =
      user.fines?.map((fine) => ({
        id: fine.id,
        status: fine.status,
        issuedAt: fine.issuedAt,
      })) ?? [];
    this.complaints =
      user.complaints?.map((complaint) => ({
        id: complaint.id,
        type: complaint.type,
        status: complaint.status,
      })) ?? [];
    this.lastGpsLog = lastGpsLog
      ? {
          id: lastGpsLog.id,
          latitude: lastGpsLog.latitude,
          longitude: lastGpsLog.longitude,
          capturedAt: lastGpsLog.capturedAt,
        }
      : null;
  }
}
