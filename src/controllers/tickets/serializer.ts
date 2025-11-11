import { Ticket } from 'orm/entities/transit/Ticket';

export const serializeTicket = (ticket: Ticket) => {
  const trip = ticket.trip;
  const route = trip?.route;
  const vehicle = trip?.vehicle;
  const driver = trip?.driver;
  const card = ticket.card;
  const user = card?.user;

  return {
    id: ticket.id,
    price: ticket.price,
    purchasedAt: ticket.purchasedAt,
    trip: trip
      ? {
          id: trip.id,
          route: route
            ? {
                id: route.id,
                number: route.number,
                direction: route.direction,
                transportType: route.transportType
                  ? {
                      id: route.transportType.id,
                      name: route.transportType.name,
                    }
                  : null,
              }
            : null,
          vehicle: vehicle
            ? {
                id: vehicle.id,
                boardNumber: vehicle.boardNumber,
              }
            : null,
          driver: driver
            ? {
                id: driver.id,
                fullName: driver.fullName,
              }
            : null,
        }
      : null,
    card: card
      ? {
          id: card.id,
          number: card.number,
          user: user
            ? {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
              }
            : null,
        }
      : null,
  };
};
