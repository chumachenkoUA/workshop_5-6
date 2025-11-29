import { CardTopUp } from 'orm/entities/transit/CardTopUp';

export class CardTopUpResponseDTO {
  id: string;
  amount: string;
  rechargedAt: Date;
  card: {
    id: string;
    number: string;
  };
  user: {
    id: number;
    fullName: string;
  } | null;

  constructor(topUp: CardTopUp) {
    this.id = topUp.id;
    this.amount = topUp.amount;
    this.rechargedAt = topUp.rechargedAt;
    this.card = {
      id: topUp.card.id,
      number: topUp.card.number,
    };
    this.user = topUp.card.user
      ? {
          id: topUp.card.user.id,
          fullName: topUp.card.user.fullName,
        }
      : null;
  }
}
