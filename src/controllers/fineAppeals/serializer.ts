import { FineAppeal } from 'orm/entities/transit/FineAppeal';

export const serializeFineAppeal = (appeal: FineAppeal) => {
  const fine = appeal.fine;
  const user = fine?.user;
  const trip = fine?.trip;
  const route = trip?.route;

  return {
    id: appeal.id,
    message: appeal.message,
    status: appeal.status,
    createdAt: appeal.createdAt,
    fine: fine
      ? {
          id: fine.id,
          status: fine.status,
          issuedAt: fine.issuedAt,
          user: user
            ? {
                id: user.id,
                fullName: user.fullName,
                phone: user.phone,
                email: user.email,
              }
            : null,
          trip: trip
            ? {
                id: trip.id,
                route: route
                  ? {
                      id: route.id,
                      number: route.number,
                      direction: route.direction,
                    }
                  : null,
              }
            : null,
        }
      : null,
  };
};
