import { Fine } from 'orm/entities/transit/Fine';

export class FineResponseDTO {
  id: string;
  status: string;
  issuedAt: Date;
  user: {
    id: number;
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
  appeal: {
    id: string;
    message: string;
    status: string;
    createdAt: Date;
  } | null;

  constructor(fine: Fine) {
    this.id = fine.id;
    this.status = fine.status;
    this.issuedAt = fine.issuedAt;
    this.user = fine.user
      ? {
          id: fine.user.id,
          fullName: fine.user.fullName,
          phone: fine.user.phone,
          email: fine.user.email,
        }
      : null;
    this.trip = fine.trip
      ? {
          id: fine.trip.id,
          route: fine.trip.route
            ? {
                id: fine.trip.route.id,
                number: fine.trip.route.number,
                direction: fine.trip.route.direction,
              }
            : null,
        }
      : null;
    this.appeal = fine.appeal
      ? {
          id: fine.appeal.id,
          message: fine.appeal.message,
          status: fine.appeal.status,
          createdAt: fine.appeal.createdAt,
        }
      : null;
  }
}
