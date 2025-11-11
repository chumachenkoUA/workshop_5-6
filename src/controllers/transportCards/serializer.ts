import { TransportCard } from 'orm/entities/transit/TransportCard';

export const serializeTransportCard = (card: TransportCard) => {
  return {
    id: card.id,
    number: card.number,
    balance: card.balance,
    user: card.user
      ? {
          id: card.user.id,
          fullName: card.user.fullName,
        }
      : null,
    tickets: card.tickets
      ? card.tickets.map((ticket) => ({
          id: ticket.id,
          price: ticket.price,
          purchasedAt: ticket.purchasedAt,
        }))
      : [],
    topUps: card.topUps
      ? card.topUps.map((topUp) => ({
          id: topUp.id,
          amount: topUp.amount,
          rechargedAt: topUp.rechargedAt,
        }))
      : [],
  };
};
