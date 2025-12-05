import { Ticket } from 'orm/entities/transit/Ticket';

type RoutePreview = {
  id: string;
  number: string;
  direction: string;
  transportType: {
    id: string;
    name: string;
  } | null;
} | null;

type TripPreview = {
  id: string;
  route: RoutePreview;
  vehicle: {
    id: string;
    boardNumber: string;
  } | null;
  driver: {
    id: string;
    fullName: string;
  } | null;
} | null;

type CardPreview = {
  id: string;
  number: string;
  user: {
    id: number;
    fullName: string;
    phone: string;
    email: string;
  } | null;
} | null;

export class TicketResponseDTO {
  id: string;
  price: string;
  purchasedAt: Date;
  trip: TripPreview;
  card: CardPreview;

  constructor(ticket: Ticket) {
    this.id = ticket.id;
    this.price = ticket.price;
    this.purchasedAt = ticket.purchasedAt;
    this.trip = ticket.trip
      ? {
          id: ticket.trip.id,
          route: ticket.trip.route
            ? {
                id: ticket.trip.route.id,
                number: ticket.trip.route.number,
                direction: ticket.trip.route.direction,
                transportType: ticket.trip.route.transportType
                  ? {
                      id: ticket.trip.route.transportType.id,
                      name: ticket.trip.route.transportType.name,
                    }
                  : null,
              }
            : null,
          vehicle: ticket.trip.vehicle
            ? {
                id: ticket.trip.vehicle.id,
                boardNumber: ticket.trip.vehicle.boardNumber,
              }
            : null,
          driver: ticket.trip.driver
            ? {
                id: ticket.trip.driver.id,
                fullName: ticket.trip.driver.fullName,
              }
            : null,
        }
      : null;
    this.card = ticket.card
      ? {
          id: ticket.card.id,
          number: ticket.card.number,
          user: ticket.card.user
            ? {
                id: ticket.card.user.id,
                fullName: ticket.card.user.fullName,
                phone: ticket.card.user.phone,
                email: ticket.card.user.email,
              }
            : null,
        }
      : null;
  }
}
