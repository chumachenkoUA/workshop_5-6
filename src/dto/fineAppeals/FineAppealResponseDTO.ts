import { FineAppeal } from 'orm/entities/transit/FineAppeal';

export class FineAppealResponseDTO {
  id: string;
  message: string;
  status: string;
  createdAt: Date;
  fine: {
    id: string;
    status: string;
    issuedAt: Date;
    user: {
      id: string;
      fullName: string;
      phone: string;
      email: string;
    } | null;
    trip: {
      id: string;
      route: {
        id: string;
        number: string;
        direction: string;
      } | null;
    } | null;
  } | null;

  constructor(appeal: FineAppeal) {
    this.id = appeal.id;
    this.message = appeal.message;
    this.status = appeal.status;
    this.createdAt = appeal.createdAt;
    this.fine = appeal.fine
      ? {
          id: appeal.fine.id,
          status: appeal.fine.status,
          issuedAt: appeal.fine.issuedAt,
          user: appeal.fine.user
            ? {
                id: appeal.fine.user.id,
                fullName: appeal.fine.user.fullName,
                phone: appeal.fine.user.phone,
                email: appeal.fine.user.email,
              }
            : null,
          trip: appeal.fine.trip
            ? {
                id: appeal.fine.trip.id,
                route: appeal.fine.trip.route
                  ? {
                      id: appeal.fine.trip.route.id,
                      number: appeal.fine.trip.route.number,
                      direction: appeal.fine.trip.route.direction,
                    }
                  : null,
              }
            : null,
        }
      : null;
  }
}
