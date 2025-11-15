import { MigrationInterface, QueryRunner } from 'typeorm';

const TABLES_WITH_SERIAL = [
  'transport_types',
  'stops',
  'transit_users',
  'drivers',
  'routes',
  'route_stops',
  'route_points',
  'vehicles',
  'driver_assignments',
  'schedules',
  'transport_cards',
  'card_top_ups',
  'trips',
  'tickets',
  'fines',
  'fine_appeals',
  'complaints',
  'user_gps_logs',
  'vehicle_gps_logs',
];

export class ResetSequences1731675000000 implements MigrationInterface {
  name = 'ResetSequences1731675000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES_WITH_SERIAL) {
      await queryRunner.query(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 0)) FROM ${table};`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of TABLES_WITH_SERIAL) {
      await queryRunner.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), 1, false);`);
    }
  }
}
