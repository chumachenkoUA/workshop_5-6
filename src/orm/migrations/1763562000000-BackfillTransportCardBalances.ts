import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillTransportCardBalances1763562000000 implements MigrationInterface {
  name = 'BackfillTransportCardBalances1763562000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE transport_cards tc
      SET balance = COALESCE((SELECT SUM(amount) FROM card_top_ups WHERE card_id = tc.id), 0)
                   - COALESCE((SELECT SUM(price) FROM tickets WHERE card_id = tc.id), 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE transport_cards SET balance = 0`);
  }
}
