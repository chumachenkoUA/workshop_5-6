import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUsernameAndStandardRole1763563000000 implements MigrationInterface {
  name = 'DropUsernameAndStandardRole1763563000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUsername = await queryRunner.hasColumn('users', 'username');
    if (hasUsername) {
      await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "UQ_fe0bb3f6520ee0469504521e710"`);
      await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

    await queryRunner.query(`UPDATE "users" SET role = 'TRANSIT' WHERE role = 'STANDARD'`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'TRANSIT'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'STANDARD'`);
    const hasUsername = await queryRunner.hasColumn('users', 'username');
    if (!hasUsername) {
      await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying(40)`);
      await queryRunner.query(
        `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
      );
    }
  }
}
