import { MigrationInterface, QueryRunner } from 'typeorm';

const TRANSIT_DEFAULT_PASSWORD_HASH = '$2a$08$xxrYSNnHdTdhjef10Zf5sOL1ZLLuj/Zy4AbTNORX636t4NkWRvTKK';

export class MergeTransitUsersIntoUsers1763560000000 implements MigrationInterface {
  name = 'MergeTransitUsersIntoUsers1763560000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const transitUsersTableExists = await queryRunner.hasTable('transit_users');

    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "phone" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "full_name" text`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "registered_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_users_phone" UNIQUE ("phone")`);

    await queryRunner.query(`ALTER TABLE "fines" DROP CONSTRAINT "FK_917fe4d65f0205b0d6373988e53"`);
    await queryRunner.query(`ALTER TABLE "user_gps_logs" DROP CONSTRAINT "FK_ba0fa011e35eb67acaaa5711234"`);
    await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_250ea1d40f7a564243d77705e09"`);
    await queryRunner.query(`ALTER TABLE "transport_cards" DROP CONSTRAINT "FK_cee9f03e3a78d412a9bf1e4a302"`);

    if (transitUsersTableExists) {
      await queryRunner.query(`
        INSERT INTO "users" (email, password, phone, full_name, name, role, registered_at, created_at, updated_at)
        SELECT tu.email,
               '${TRANSIT_DEFAULT_PASSWORD_HASH}',
               tu.phone,
               tu.full_name,
               tu.full_name,
               'TRANSIT',
               tu.registered_at,
               NOW(),
               NOW()
        FROM transit_users tu
        ON CONFLICT (email) DO NOTHING;
      `);

      await queryRunner.query(`
        UPDATE transport_cards tc
        SET user_id = u.id
        FROM transit_users tu
        JOIN users u ON u.email = tu.email
        WHERE tc.user_id = tu.id;
      `);
      await queryRunner.query(`
        UPDATE fines f
        SET user_id = u.id
        FROM transit_users tu
        JOIN users u ON u.email = tu.email
        WHERE f.user_id = tu.id;
      `);
      await queryRunner.query(`
        UPDATE complaints c
        SET user_id = u.id
        FROM transit_users tu
        JOIN users u ON u.email = tu.email
        WHERE c.user_id = tu.id;
      `);
      await queryRunner.query(`
        UPDATE user_gps_logs ugl
        SET user_id = u.id
        FROM transit_users tu
        JOIN users u ON u.email = tu.email
        WHERE ugl.user_id = tu.id;
      `);
    }

    await queryRunner.query(
      `ALTER TABLE "transport_cards" ALTER COLUMN "user_id" TYPE integer USING "user_id"::integer`,
    );
    await queryRunner.query(`ALTER TABLE "fines" ALTER COLUMN "user_id" TYPE integer USING "user_id"::integer`);
    await queryRunner.query(`ALTER TABLE "complaints" ALTER COLUMN "user_id" TYPE integer USING "user_id"::integer`);
    await queryRunner.query(`ALTER TABLE "user_gps_logs" ALTER COLUMN "user_id" TYPE integer USING "user_id"::integer`);

    await queryRunner.query(`
      ALTER TABLE "fines"
      ADD CONSTRAINT "FK_917fe4d65f0205b0d6373988e53" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_gps_logs"
      ADD CONSTRAINT "FK_ba0fa011e35eb67acaaa5711234" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "complaints"
      ADD CONSTRAINT "FK_250ea1d40f7a564243d77705e09" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "transport_cards"
      ADD CONSTRAINT "FK_cee9f03e3a78d412a9bf1e4a302" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    if (transitUsersTableExists) {
      await queryRunner.query(`DROP TABLE "transit_users"`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "transit_users" (
        "id" BIGSERIAL NOT NULL,
        "email" text NOT NULL,
        "phone" text NOT NULL,
        "full_name" text NOT NULL,
        "registered_at" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "transit_users_phone_unique" UNIQUE ("phone"),
        CONSTRAINT "transit_users_email_unique" UNIQUE ("email"),
        CONSTRAINT "PK_65c5cf6b9a27b1681224a526f46" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO transit_users (id, email, phone, full_name, registered_at)
      SELECT id, email, COALESCE(phone, ''), COALESCE(full_name, ''), COALESCE(registered_at, NOW())
      FROM users
      WHERE role = 'TRANSIT'
      ON CONFLICT (id) DO NOTHING;
    `);
    await queryRunner.query(
      `SELECT setval(pg_get_serial_sequence('transit_users','id'), COALESCE(MAX(id),0)) FROM transit_users;`,
    );

    await queryRunner.query(`ALTER TABLE "transport_cards" DROP CONSTRAINT "FK_cee9f03e3a78d412a9bf1e4a302"`);
    await queryRunner.query(`ALTER TABLE "complaints" DROP CONSTRAINT "FK_250ea1d40f7a564243d77705e09"`);
    await queryRunner.query(`ALTER TABLE "user_gps_logs" DROP CONSTRAINT "FK_ba0fa011e35eb67acaaa5711234"`);
    await queryRunner.query(`ALTER TABLE "fines" DROP CONSTRAINT "FK_917fe4d65f0205b0d6373988e53"`);

    await queryRunner.query(`
      UPDATE transport_cards tc
      SET user_id = tu.id
      FROM users u
      JOIN transit_users tu ON tu.email = u.email
      WHERE tc.user_id = u.id;
    `);
    await queryRunner.query(`
      UPDATE fines f
      SET user_id = tu.id
      FROM users u
      JOIN transit_users tu ON tu.email = u.email
      WHERE f.user_id = u.id;
    `);
    await queryRunner.query(`
      UPDATE complaints c
      SET user_id = tu.id
      FROM users u
      JOIN transit_users tu ON tu.email = u.email
      WHERE c.user_id = u.id;
    `);
    await queryRunner.query(`
      UPDATE user_gps_logs ugl
      SET user_id = tu.id
      FROM users u
      JOIN transit_users tu ON tu.email = u.email
      WHERE ugl.user_id = u.id;
    `);

    await queryRunner.query(`ALTER TABLE "transport_cards" ALTER COLUMN "user_id" TYPE bigint USING "user_id"::bigint`);
    await queryRunner.query(`ALTER TABLE "fines" ALTER COLUMN "user_id" TYPE bigint USING "user_id"::bigint`);
    await queryRunner.query(`ALTER TABLE "complaints" ALTER COLUMN "user_id" TYPE bigint USING "user_id"::bigint`);
    await queryRunner.query(`ALTER TABLE "user_gps_logs" ALTER COLUMN "user_id" TYPE bigint USING "user_id"::bigint`);

    await queryRunner.query(`
      ALTER TABLE "transport_cards"
      ADD CONSTRAINT "FK_cee9f03e3a78d412a9bf1e4a302" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "complaints"
      ADD CONSTRAINT "FK_250ea1d40f7a564243d77705e09" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_gps_logs"
      ADD CONSTRAINT "FK_ba0fa011e35eb67acaaa5711234" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "fines"
      ADD CONSTRAINT "FK_917fe4d65f0205b0d6373988e53" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`DELETE FROM users WHERE role = 'TRANSIT'`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_users_phone"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "registered_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "full_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
  }
}
