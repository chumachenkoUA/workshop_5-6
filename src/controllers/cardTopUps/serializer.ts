import { CardTopUp } from 'orm/entities/transit/CardTopUp';

export const serializeCardTopUp = (topUp: CardTopUp) => {
  const user = topUp.card.user;

  return {
    id: topUp.id,
    amount: topUp.amount,
    rechargedAt: topUp.rechargedAt,
    card: {
      id: topUp.card.id,
      number: topUp.card.number,
    },
    user: user
      ? {
          id: user.id,
          fullName: user.fullName,
        }
      : null,
  };
};
