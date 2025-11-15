import { TransportCard } from 'orm/entities/transit/TransportCard';

type UserPreview = {
  id: string;
  fullName: string;
} | null;

type TicketPreview = {
  id: string;
  price: string;
  purchasedAt: Date;
};

type TopUpPreview = {
  id: string;
  amount: string;
  rechargedAt: Date;
};

export class TransportCardResponseDTO {
  id: string;
  number: string;
  balance: string;
  user: UserPreview;
  tickets: TicketPreview[];
  topUps: TopUpPreview[];

  constructor(card: TransportCard) {
    this.id = card.id;
    this.number = card.number;
    this.balance = card.balance;
    this.user = card.user
      ? {
          id: card.user.id,
          fullName: card.user.fullName,
        }
      : null;
    this.tickets =
      card.tickets?.map((ticket) => ({
        id: ticket.id,
        price: ticket.price,
        purchasedAt: ticket.purchasedAt,
      })) ?? [];
    this.topUps =
      card.topUps?.map((topUp) => ({
        id: topUp.id,
        amount: topUp.amount,
        rechargedAt: topUp.rechargedAt,
      })) ?? [];
  }
}
