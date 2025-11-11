import { TransitUser } from 'orm/entities/transit/TransitUser';
import { UserGpsLog } from 'orm/entities/transit/UserGpsLog';

export const serializeTransitUser = (user: TransitUser, lastGpsLog: UserGpsLog | null) => {
  return {
    id: user.id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    registeredAt: user.registeredAt,
    transportCard: user.transportCard
      ? {
          id: user.transportCard.id,
          number: user.transportCard.number,
          balance: user.transportCard.balance,
        }
      : null,
    fines: user.fines
      ? user.fines.map((fine) => ({
          id: fine.id,
          status: fine.status,
          issuedAt: fine.issuedAt,
        }))
      : [],
    complaints: user.complaints
      ? user.complaints.map((complaint) => ({
          id: complaint.id,
          type: complaint.type,
          status: complaint.status,
        }))
      : [],
    lastGpsLog: lastGpsLog
      ? {
          id: lastGpsLog.id,
          latitude: lastGpsLog.latitude,
          longitude: lastGpsLog.longitude,
          capturedAt: lastGpsLog.capturedAt,
        }
      : null,
  };
};
