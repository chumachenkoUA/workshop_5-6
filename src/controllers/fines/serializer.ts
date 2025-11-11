import { Fine } from 'orm/entities/transit/Fine';

export const serializeFine = (fine: Fine) => {
  const user = fine.user;
  const trip = fine.trip;
  const route = trip?.route;
  const appeal = fine.appeal;

  return {
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
    appeal: appeal
      ? {
          id: appeal.id,
          message: appeal.message,
          status: appeal.status,
          createdAt: appeal.createdAt,
        }
      : null,
  };
};
