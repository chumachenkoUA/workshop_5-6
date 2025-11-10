import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTransitEntities1762785696596 implements MigrationInterface {
  name = 'CreateTransitEntities1762785696596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "fine_appeals" (
                "id" BIGSERIAL NOT NULL,
                "message" text NOT NULL,
                "status" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "fine_id" bigint,
                CONSTRAINT "fine_appeals_fine_unique" UNIQUE ("fine_id"),
                CONSTRAINT "REL_8f54bc5d6cc8fa92931332834b" UNIQUE ("fine_id"),
                CONSTRAINT "fine_appeals_status_check" CHECK (
                    "status" IN ('Подано', 'Перевіряється', 'Відхилено', 'Прийнято')
                ),
                CONSTRAINT "PK_4de0531817e29d0692cde90f376" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "fines" (
                "id" BIGSERIAL NOT NULL,
                "status" text NOT NULL,
                "issued_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" bigint,
                "trip_id" bigint,
                CONSTRAINT "fines_status_check" CHECK (
                    "status" IN ('В процесі', 'Оплачено', 'Відмінено', 'Просрочено')
                ),
                CONSTRAINT "PK_b706344bc8943ab7a88ed5d312e" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "user_gps_logs" (
                "id" BIGSERIAL NOT NULL,
                "longitude" numeric(10, 7) NOT NULL,
                "latitude" numeric(10, 7) NOT NULL,
                "captured_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" bigint,
                CONSTRAINT "PK_a3ec658cfe7478aa204be78c871" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transit_users" (
                "id" BIGSERIAL NOT NULL,
                "email" text NOT NULL,
                "phone" text NOT NULL,
                "full_name" text NOT NULL,
                "registered_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "transit_users_phone_unique" UNIQUE ("phone"),
                CONSTRAINT "transit_users_email_unique" UNIQUE ("email"),
                CONSTRAINT "PK_65c5cf6b9a27b1681224a526f46" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "complaints" (
                "id" BIGSERIAL NOT NULL,
                "type" text NOT NULL,
                "message" text NOT NULL,
                "status" text NOT NULL,
                "user_id" bigint,
                "trip_id" bigint,
                CONSTRAINT "complaints_status_check" CHECK (
                    "status" IN ('Подано', 'Розглядається', 'Розглянуто')
                ),
                CONSTRAINT "PK_4b7566a2a489c2cc7c12ed076ad" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "route_points" (
                "id" BIGSERIAL NOT NULL,
                "longitude" numeric(10, 7) NOT NULL,
                "latitude" numeric(10, 7) NOT NULL,
                "route_id" bigint,
                "previous_route_point_id" bigint,
                "next_route_point_id" bigint,
                CONSTRAINT "route_points_next_unique" UNIQUE ("next_route_point_id"),
                CONSTRAINT "route_points_previous_unique" UNIQUE ("previous_route_point_id"),
                CONSTRAINT "route_points_coordinates_unique" UNIQUE ("route_id", "longitude", "latitude"),
                CONSTRAINT "REL_d342ae1979b89a6725e2024575" UNIQUE ("previous_route_point_id"),
                CONSTRAINT "REL_69a8c163da9af824ef17ef0734" UNIQUE ("next_route_point_id"),
                CONSTRAINT "PK_9684d129d71ff38906e7cb08c68" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "stops" (
                "id" BIGSERIAL NOT NULL,
                "name" text NOT NULL,
                "longitude" numeric(10, 7) NOT NULL,
                "latitude" numeric(10, 7) NOT NULL,
                CONSTRAINT "stops_name_coordinates_unique" UNIQUE ("name", "longitude", "latitude"),
                CONSTRAINT "PK_ed1be877403ad3c921b07f62ca5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "route_stops" (
                "id" BIGSERIAL NOT NULL,
                "route_id" bigint,
                "stop_id" bigint,
                "previous_route_stop_id" bigint,
                "next_route_stop_id" bigint,
                CONSTRAINT "route_stops_next_unique" UNIQUE ("next_route_stop_id"),
                CONSTRAINT "route_stops_previous_unique" UNIQUE ("previous_route_stop_id"),
                CONSTRAINT "route_stops_route_stop_unique" UNIQUE ("route_id", "stop_id"),
                CONSTRAINT "REL_02462022ad47de87fecd756fac" UNIQUE ("previous_route_stop_id"),
                CONSTRAINT "REL_9f8ca28598a08aae8f24e46fde" UNIQUE ("next_route_stop_id"),
                CONSTRAINT "PK_22c09afc24c0a7a13644c629073" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "schedules" (
                "id" BIGSERIAL NOT NULL,
                "workday_start" TIME NOT NULL,
                "workday_end" TIME NOT NULL,
                "interval_minutes" integer NOT NULL,
                "route_id" bigint,
                CONSTRAINT "schedules_route_unique" UNIQUE ("route_id"),
                CONSTRAINT "REL_7383489bead044163604da268a" UNIQUE ("route_id"),
                CONSTRAINT "schedules_interval_positive" CHECK ("interval_minutes" > 0),
                CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transport_types" (
                "id" BIGSERIAL NOT NULL,
                "name" text NOT NULL,
                CONSTRAINT "transport_types_name_unique" UNIQUE ("name"),
                CONSTRAINT "PK_798b40b4bdf4aa75d716cdf954c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "routes" (
                "id" BIGSERIAL NOT NULL,
                "number" text NOT NULL,
                "direction" text NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                "transport_type_id" bigint,
                CONSTRAINT "routes_type_number_direction_unique" UNIQUE ("transport_type_id", "number", "direction"),
                CONSTRAINT "routes_direction_check" CHECK ("direction" IN ('прямий', 'зворотній')),
                CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "vehicle_gps_logs" (
                "id" BIGSERIAL NOT NULL,
                "longitude" numeric(10, 7) NOT NULL,
                "latitude" numeric(10, 7) NOT NULL,
                "captured_at" TIMESTAMP NOT NULL DEFAULT now(),
                "vehicle_id" bigint,
                CONSTRAINT "PK_5326d2faa3adc2e1c0b339f173f" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "vehicles" (
                "id" BIGSERIAL NOT NULL,
                "board_number" text NOT NULL,
                "capacity" integer NOT NULL,
                "transport_type_id" bigint,
                "route_id" bigint,
                CONSTRAINT "vehicles_board_number_unique" UNIQUE ("board_number"),
                CONSTRAINT "vehicles_capacity_positive" CHECK ("capacity" > 0),
                CONSTRAINT "PK_18d8646b59304dce4af3a9e35b6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "driver_assignments" (
                "id" BIGSERIAL NOT NULL,
                "assigned_at" TIMESTAMP NOT NULL DEFAULT now(),
                "driver_id" bigint,
                "vehicle_id" bigint,
                CONSTRAINT "driver_assignments_unique" UNIQUE ("driver_id", "vehicle_id", "assigned_at"),
                CONSTRAINT "PK_b72677caff7b7e9acad3d55b3ec" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "drivers" (
                "id" BIGSERIAL NOT NULL,
                "email" text NOT NULL,
                "phone" text NOT NULL,
                "full_name" text NOT NULL,
                "license_data" text NOT NULL,
                "passport_data" jsonb NOT NULL,
                CONSTRAINT "drivers_license_unique" UNIQUE ("license_data"),
                CONSTRAINT "drivers_phone_unique" UNIQUE ("phone"),
                CONSTRAINT "drivers_email_unique" UNIQUE ("email"),
                CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "trips" (
                "id" BIGSERIAL NOT NULL,
                "started_at" TIMESTAMP NOT NULL,
                "ended_at" TIMESTAMP NOT NULL,
                "passenger_count" integer NOT NULL DEFAULT '0',
                "route_id" bigint,
                "vehicle_id" bigint,
                "driver_id" bigint,
                CONSTRAINT "trips_vehicle_time_unique" UNIQUE ("vehicle_id", "started_at", "ended_at"),
                CONSTRAINT "trips_passengers_non_negative" CHECK ("passenger_count" >= 0),
                CONSTRAINT "trips_duration_positive" CHECK ("ended_at" > "started_at"),
                CONSTRAINT "PK_f71c231dee9c05a9522f9e840f5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "tickets" (
                "id" BIGSERIAL NOT NULL,
                "price" numeric(12, 2) NOT NULL,
                "purchased_at" TIMESTAMP NOT NULL DEFAULT now(),
                "trip_id" bigint,
                "card_id" bigint,
                CONSTRAINT "tickets_non_negative_price" CHECK ("price" >= 0),
                CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "transport_cards" (
                "id" BIGSERIAL NOT NULL,
                "balance" numeric(12, 2) NOT NULL DEFAULT 0,
                "number" text NOT NULL,
                "user_id" bigint,
                CONSTRAINT "transport_cards_user_unique" UNIQUE ("user_id"),
                CONSTRAINT "transport_cards_number_unique" UNIQUE ("number"),
                CONSTRAINT "REL_cee9f03e3a78d412a9bf1e4a30" UNIQUE ("user_id"),
                CONSTRAINT "transport_cards_balance_non_negative" CHECK ("balance" >= 0),
                CONSTRAINT "PK_61d495f214f4d8949072517111c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "card_top_ups" (
                "id" BIGSERIAL NOT NULL,
                "amount" numeric(12, 2) NOT NULL,
                "recharged_at" TIMESTAMP NOT NULL DEFAULT now(),
                "card_id" bigint,
                CONSTRAINT "card_top_ups_positive_amount" CHECK ("amount" > 0),
                CONSTRAINT "PK_d6bca2f02abad32199ee6ab3943" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "fine_appeals"
            ADD CONSTRAINT "FK_8f54bc5d6cc8fa92931332834b2" FOREIGN KEY ("fine_id") REFERENCES "fines"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "fines"
            ADD CONSTRAINT "FK_917fe4d65f0205b0d6373988e53" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "fines"
            ADD CONSTRAINT "FK_0960c22fda360e346e1574b7443" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "user_gps_logs"
            ADD CONSTRAINT "FK_ba0fa011e35eb67acaaa5711234" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "complaints"
            ADD CONSTRAINT "FK_250ea1d40f7a564243d77705e09" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "complaints"
            ADD CONSTRAINT "FK_76de72e6fa44cd541e34eac27ab" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_points"
            ADD CONSTRAINT "FK_3831bd2727c131855bcd8064d2a" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_points"
            ADD CONSTRAINT "FK_d342ae1979b89a6725e20245757" FOREIGN KEY ("previous_route_point_id") REFERENCES "route_points"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_points"
            ADD CONSTRAINT "FK_69a8c163da9af824ef17ef07342" FOREIGN KEY ("next_route_point_id") REFERENCES "route_points"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops"
            ADD CONSTRAINT "FK_b16cab5c66870949cbb4ee748c0" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops"
            ADD CONSTRAINT "FK_3d326d5552dacba78e0aba897c3" FOREIGN KEY ("stop_id") REFERENCES "stops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops"
            ADD CONSTRAINT "FK_02462022ad47de87fecd756facc" FOREIGN KEY ("previous_route_stop_id") REFERENCES "route_stops"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops"
            ADD CONSTRAINT "FK_9f8ca28598a08aae8f24e46fdef" FOREIGN KEY ("next_route_stop_id") REFERENCES "route_stops"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "schedules"
            ADD CONSTRAINT "FK_7383489bead044163604da268a9" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "routes"
            ADD CONSTRAINT "FK_84514022b4103fd5b90f2fab6b7" FOREIGN KEY ("transport_type_id") REFERENCES "transport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "vehicle_gps_logs"
            ADD CONSTRAINT "FK_d38187ace9c16e79b5b58201511" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "vehicles"
            ADD CONSTRAINT "FK_4354357781742732f9d87c7677e" FOREIGN KEY ("transport_type_id") REFERENCES "transport_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "vehicles"
            ADD CONSTRAINT "FK_7e0bb6ee15c8ca251fd96fe79b0" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "driver_assignments"
            ADD CONSTRAINT "FK_3b70749e81638d9f7e532c8b9a2" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "driver_assignments"
            ADD CONSTRAINT "FK_330d40bec9c1e86d89906cfea47" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_e49dbbd9991c9b7baec9779e7ce" FOREIGN KEY ("route_id") REFERENCES "routes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_ab4b806373c2ee43946679d572e" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "trips"
            ADD CONSTRAINT "FK_44d36110fb38f45c2f15c946ddb" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tickets"
            ADD CONSTRAINT "FK_17ab88e73e459c553b2a931e9eb" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "tickets"
            ADD CONSTRAINT "FK_ba7afb3e0f9113c88c467c36dff" FOREIGN KEY ("card_id") REFERENCES "transport_cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "transport_cards"
            ADD CONSTRAINT "FK_cee9f03e3a78d412a9bf1e4a302" FOREIGN KEY ("user_id") REFERENCES "transit_users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "card_top_ups"
            ADD CONSTRAINT "FK_39ee6f65b46c68b2ab040a8f3e7" FOREIGN KEY ("card_id") REFERENCES "transport_cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "card_top_ups" DROP CONSTRAINT "FK_39ee6f65b46c68b2ab040a8f3e7"
        `);
    await queryRunner.query(`
            ALTER TABLE "transport_cards" DROP CONSTRAINT "FK_cee9f03e3a78d412a9bf1e4a302"
        `);
    await queryRunner.query(`
            ALTER TABLE "tickets" DROP CONSTRAINT "FK_ba7afb3e0f9113c88c467c36dff"
        `);
    await queryRunner.query(`
            ALTER TABLE "tickets" DROP CONSTRAINT "FK_17ab88e73e459c553b2a931e9eb"
        `);
    await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_44d36110fb38f45c2f15c946ddb"
        `);
    await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_ab4b806373c2ee43946679d572e"
        `);
    await queryRunner.query(`
            ALTER TABLE "trips" DROP CONSTRAINT "FK_e49dbbd9991c9b7baec9779e7ce"
        `);
    await queryRunner.query(`
            ALTER TABLE "driver_assignments" DROP CONSTRAINT "FK_330d40bec9c1e86d89906cfea47"
        `);
    await queryRunner.query(`
            ALTER TABLE "driver_assignments" DROP CONSTRAINT "FK_3b70749e81638d9f7e532c8b9a2"
        `);
    await queryRunner.query(`
            ALTER TABLE "vehicles" DROP CONSTRAINT "FK_7e0bb6ee15c8ca251fd96fe79b0"
        `);
    await queryRunner.query(`
            ALTER TABLE "vehicles" DROP CONSTRAINT "FK_4354357781742732f9d87c7677e"
        `);
    await queryRunner.query(`
            ALTER TABLE "vehicle_gps_logs" DROP CONSTRAINT "FK_d38187ace9c16e79b5b58201511"
        `);
    await queryRunner.query(`
            ALTER TABLE "routes" DROP CONSTRAINT "FK_84514022b4103fd5b90f2fab6b7"
        `);
    await queryRunner.query(`
            ALTER TABLE "schedules" DROP CONSTRAINT "FK_7383489bead044163604da268a9"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops" DROP CONSTRAINT "FK_9f8ca28598a08aae8f24e46fdef"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops" DROP CONSTRAINT "FK_02462022ad47de87fecd756facc"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops" DROP CONSTRAINT "FK_3d326d5552dacba78e0aba897c3"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_stops" DROP CONSTRAINT "FK_b16cab5c66870949cbb4ee748c0"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_points" DROP CONSTRAINT "FK_69a8c163da9af824ef17ef07342"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_points" DROP CONSTRAINT "FK_d342ae1979b89a6725e20245757"
        `);
    await queryRunner.query(`
            ALTER TABLE "route_points" DROP CONSTRAINT "FK_3831bd2727c131855bcd8064d2a"
        `);
    await queryRunner.query(`
            ALTER TABLE "complaints" DROP CONSTRAINT "FK_76de72e6fa44cd541e34eac27ab"
        `);
    await queryRunner.query(`
            ALTER TABLE "complaints" DROP CONSTRAINT "FK_250ea1d40f7a564243d77705e09"
        `);
    await queryRunner.query(`
            ALTER TABLE "user_gps_logs" DROP CONSTRAINT "FK_ba0fa011e35eb67acaaa5711234"
        `);
    await queryRunner.query(`
            ALTER TABLE "fines" DROP CONSTRAINT "FK_0960c22fda360e346e1574b7443"
        `);
    await queryRunner.query(`
            ALTER TABLE "fines" DROP CONSTRAINT "FK_917fe4d65f0205b0d6373988e53"
        `);
    await queryRunner.query(`
            ALTER TABLE "fine_appeals" DROP CONSTRAINT "FK_8f54bc5d6cc8fa92931332834b2"
        `);
    await queryRunner.query(`
            DROP TABLE "card_top_ups"
        `);
    await queryRunner.query(`
            DROP TABLE "transport_cards"
        `);
    await queryRunner.query(`
            DROP TABLE "tickets"
        `);
    await queryRunner.query(`
            DROP TABLE "trips"
        `);
    await queryRunner.query(`
            DROP TABLE "drivers"
        `);
    await queryRunner.query(`
            DROP TABLE "driver_assignments"
        `);
    await queryRunner.query(`
            DROP TABLE "vehicles"
        `);
    await queryRunner.query(`
            DROP TABLE "vehicle_gps_logs"
        `);
    await queryRunner.query(`
            DROP TABLE "routes"
        `);
    await queryRunner.query(`
            DROP TABLE "transport_types"
        `);
    await queryRunner.query(`
            DROP TABLE "schedules"
        `);
    await queryRunner.query(`
            DROP TABLE "route_stops"
        `);
    await queryRunner.query(`
            DROP TABLE "stops"
        `);
    await queryRunner.query(`
            DROP TABLE "route_points"
        `);
    await queryRunner.query(`
            DROP TABLE "complaints"
        `);
    await queryRunner.query(`
            DROP TABLE "transit_users"
        `);
    await queryRunner.query(`
            DROP TABLE "user_gps_logs"
        `);
    await queryRunner.query(`
            DROP TABLE "fines"
        `);
    await queryRunner.query(`
            DROP TABLE "fine_appeals"
        `);
  }
}
