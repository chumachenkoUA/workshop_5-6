import { MigrationInterface, QueryRunner } from 'typeorm';

const TRANSIT_DEFAULT_PASSWORD_HASH = '$2a$08$xxrYSNnHdTdhjef10Zf5sOL1ZLLuj/Zy4AbTNORX636t4NkWRvTKK';

export class TransitSeed17630441445221763044144522 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO transport_types (id, name) VALUES
        (1,'Автобус'),
        (2,'Трамвай'),
        (3,'Тролейбус');
    `);

    await queryRunner.query(`
      INSERT INTO stops (id, name, longitude, latitude) VALUES
        (1,'Центральна площа', 30.5234567, 50.4501234),
        (2,'Вокзал', 30.5012345, 50.4478123),
        (3,'Магазин', 30.5154321, 50.4487654),
        (4,'Університет', 30.5300000, 50.4515000),
        (5,'Парк', 30.5350000, 50.4522000);
    `);

    await queryRunner.query(`
      INSERT INTO users (id, email, phone, full_name, name, password, role, registered_at) VALUES
        (11,'pupkin@example.com','+380991112233','Пупкін Василь Олександрович','Пупкін Василь Олександрович','${TRANSIT_DEFAULT_PASSWORD_HASH}','TRANSIT', now()),
        (12,'ivanova@example.com','+380992223344','Іванова Марія Сергіївна','Іванова Марія Сергіївна','${TRANSIT_DEFAULT_PASSWORD_HASH}','TRANSIT', now()),
        (13,'bondar@example.com','+380993334455','Бондар Олег Ігорович','Бондар Олег Ігорович','${TRANSIT_DEFAULT_PASSWORD_HASH}','TRANSIT', now()),
        (14,'shevchenko@example.com','+380994445566','Шевченко Олена Петрівна','Шевченко Олена Петрівна','${TRANSIT_DEFAULT_PASSWORD_HASH}','TRANSIT', now());
    `);

    await queryRunner.query(`
      INSERT INTO drivers (id, email, phone, full_name, license_data, passport_data) VALUES
        (1,'driver1@example.com','+380971112233','Сидоренко Петро Іванович','KP123456','{"series":"AB","number":"123456"}'),
        (2,'driver2@example.com','+380972223344','Коваль Андрій Петрович','KP654321','{"series":"AB","number":"654321"}'),
        (3,'driver3@example.com','+380973334455','Мельник Ігор Васильович','KP777888','{"series":"BC","number":"777888"}');
    `);

    await queryRunner.query(`
      INSERT INTO routes (id, transport_type_id, number, direction, is_active) VALUES
        (1,1,'12','прямий',true),
        (2,3,'5','прямий',true);
    `);

    await queryRunner.query(`
      INSERT INTO route_stops (id, route_id, stop_id, previous_route_stop_id, next_route_stop_id) VALUES
        (1,1,1,NULL,2),
        (2,1,2,1,3),
        (3,1,3,2,4),
        (4,1,4,3,5),
        (5,1,5,4,NULL),
        (6,2,1,NULL,7),
        (7,2,4,6,8),
        (8,2,2,7,NULL);
    `);

    await queryRunner.query(`
      INSERT INTO route_points (id, route_id, longitude, latitude, previous_route_point_id, next_route_point_id) VALUES
        (1,1,30.5234567,50.4501234,NULL,2),
        (2,1,30.5220000,50.4498000,1,3),
        (3,1,30.5200000,50.4490000,2,4),
        (4,1,30.5180000,50.4483000,3,5),
        (5,1,30.5165000,50.4480000,4,6),
        (6,1,30.5150000,50.4477000,5,NULL),
        (7,2,30.5234567,50.4501234,NULL,8),
        (8,2,30.5300000,50.4515000,7,9),
        (9,2,30.5012345,50.4478123,8,NULL);
    `);

    await queryRunner.query(`
      INSERT INTO vehicles (id, board_number, transport_type_id, capacity, route_id) VALUES
        (1,'AB-001',1,50,1),
        (2,'AB-002',1,50,1),
        (3,'TB-101',3,80,2);
    `);

    await queryRunner.query(`
      INSERT INTO driver_assignments (id, driver_id, vehicle_id, assigned_at) VALUES
        (1,1,1,'2025-06-09 07:30'),
        (2,2,2,'2025-06-09 07:40'),
        (3,3,3,'2025-06-09 08:30');
    `);

    await queryRunner.query(`
      INSERT INTO schedules (id, route_id, workday_start, workday_end, interval_minutes) VALUES
        (1,1,'06:00','23:00',10),
        (2,2,'06:30','22:30',12);
    `);

    await queryRunner.query(`
      INSERT INTO transport_cards (id, user_id, balance, number) VALUES
        (1,11,0,'CARD-0001'),
        (2,12,0,'CARD-0002'),
        (3,13,0,'CARD-0003'),
        (4,14,0,'CARD-0004');
    `);

    await queryRunner.query(`
      INSERT INTO card_top_ups (id, card_id, amount) VALUES
        (1,1,200.00),
        (2,2,150.00),
        (3,3,100.00),
        (4,4,50.00);
    `);

    await queryRunner.query(`
      UPDATE transport_cards tc
      SET balance = COALESCE((
        SELECT SUM(amount) FROM card_top_ups WHERE card_id = tc.id
      ), 0)
      WHERE tc.id IN (1,2,3,4);
    `);

    await queryRunner.query(`
      INSERT INTO trips (id, route_id, vehicle_id, driver_id, started_at, ended_at, passenger_count) VALUES
        (1,1,1,1,'2025-06-09 08:00','2025-06-09 08:40',0),
        (2,1,2,2,'2025-06-09 09:00','2025-06-09 09:40',0),
        (3,2,3,3,'2025-06-09 10:00','2025-06-09 10:30',0);
    `);

    await queryRunner.query(`
      INSERT INTO tickets (id, trip_id, card_id, price) VALUES
        (1,1,1,15.00),
        (2,2,2,15.00),
        (3,2,3,15.00),
        (4,3,4,20.00);
    `);

    await queryRunner.query(`
      INSERT INTO fines (id, user_id, status, trip_id, issued_at) VALUES
        (1,12,'В процесі',1,'2025-06-09 08:30'),
        (2,13,'Оплачено',2,'2025-06-09 09:20');
    `);

    await queryRunner.query(`
      INSERT INTO fine_appeals (id, fine_id, message, status, created_at) VALUES
        (1,1,'Прошу скасувати штраф — купон був!','Подано','2025-06-09 09:00'),
        (2,2,'Штраф сплачено помилково, прошу повернення','Подано','2025-06-09 10:00');
    `);

    await queryRunner.query(`
      INSERT INTO complaints (id, user_id, type, message, trip_id, status) VALUES
        (1,11,'Пропозиція','Будь ласка, додайте кондиціонер у салоні',1,'Подано'),
        (2,14,'Скарга','Довго чекала на зупинці Парк',3,'Подано');
    `);

    await queryRunner.query(`
      INSERT INTO user_gps_logs (id, user_id, longitude, latitude) VALUES
        (1,11,30.5240000,50.4500000),
        (2,12,30.5200000,50.4490000);
    `);

    await queryRunner.query(`
      INSERT INTO vehicle_gps_logs (id, vehicle_id, longitude, latitude) VALUES
        (1,1,30.5280000,50.4510000);
    `);

    await queryRunner.query(`
      SELECT setval(pg_get_serial_sequence('transport_types','id'), COALESCE(MAX(id),0)) FROM transport_types;
      SELECT setval(pg_get_serial_sequence('users','id'), COALESCE(MAX(id),0)) FROM users;
      SELECT setval(pg_get_serial_sequence('stops','id'), COALESCE(MAX(id),0)) FROM stops;
      SELECT setval(pg_get_serial_sequence('drivers','id'), COALESCE(MAX(id),0)) FROM drivers;
      SELECT setval(pg_get_serial_sequence('routes','id'), COALESCE(MAX(id),0)) FROM routes;
      SELECT setval(pg_get_serial_sequence('route_stops','id'), COALESCE(MAX(id),0)) FROM route_stops;
      SELECT setval(pg_get_serial_sequence('route_points','id'), COALESCE(MAX(id),0)) FROM route_points;
      SELECT setval(pg_get_serial_sequence('vehicles','id'), COALESCE(MAX(id),0)) FROM vehicles;
      SELECT setval(pg_get_serial_sequence('driver_assignments','id'), COALESCE(MAX(id),0)) FROM driver_assignments;
      SELECT setval(pg_get_serial_sequence('schedules','id'), COALESCE(MAX(id),0)) FROM schedules;
      SELECT setval(pg_get_serial_sequence('transport_cards','id'), COALESCE(MAX(id),0)) FROM transport_cards;
      SELECT setval(pg_get_serial_sequence('card_top_ups','id'), COALESCE(MAX(id),0)) FROM card_top_ups;
      SELECT setval(pg_get_serial_sequence('trips','id'), COALESCE(MAX(id),0)) FROM trips;
      SELECT setval(pg_get_serial_sequence('tickets','id'), COALESCE(MAX(id),0)) FROM tickets;
      SELECT setval(pg_get_serial_sequence('fines','id'), COALESCE(MAX(id),0)) FROM fines;
      SELECT setval(pg_get_serial_sequence('fine_appeals','id'), COALESCE(MAX(id),0)) FROM fine_appeals;
      SELECT setval(pg_get_serial_sequence('complaints','id'), COALESCE(MAX(id),0)) FROM complaints;
      SELECT setval(pg_get_serial_sequence('user_gps_logs','id'), COALESCE(MAX(id),0)) FROM user_gps_logs;
      SELECT setval(pg_get_serial_sequence('vehicle_gps_logs','id'), COALESCE(MAX(id),0)) FROM vehicle_gps_logs;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM vehicle_gps_logs WHERE id IN (1);`);
    await queryRunner.query(`DELETE FROM user_gps_logs WHERE id IN (1,2);`);
    await queryRunner.query(`DELETE FROM complaints WHERE id IN (1,2);`);
    await queryRunner.query(`DELETE FROM fine_appeals WHERE id IN (1,2);`);
    await queryRunner.query(`DELETE FROM fines WHERE id IN (1,2);`);
    await queryRunner.query(`DELETE FROM tickets WHERE id IN (1,2,3,4);`);
    await queryRunner.query(`DELETE FROM trips WHERE id IN (1,2,3);`);
    await queryRunner.query(`DELETE FROM card_top_ups WHERE id IN (1,2,3,4);`);
    await queryRunner.query(`DELETE FROM transport_cards WHERE id IN (1,2,3,4);`);
    await queryRunner.query(`DELETE FROM schedules WHERE id IN (1,2);`);
    await queryRunner.query(`DELETE FROM driver_assignments WHERE id IN (1,2,3);`);
    await queryRunner.query(`DELETE FROM vehicles WHERE id IN (1,2,3);`);
    await queryRunner.query(`DELETE FROM route_points WHERE id IN (1,2,3,4,5,6,7,8,9);`);
    await queryRunner.query(`DELETE FROM route_stops WHERE id IN (1,2,3,4,5,6,7,8);`);
    await queryRunner.query(`DELETE FROM routes WHERE id IN (1,2);`);
    await queryRunner.query(`DELETE FROM drivers WHERE id IN (1,2,3);`);
    await queryRunner.query(`DELETE FROM users WHERE id IN (11,12,13,14);`);
    await queryRunner.query(`DELETE FROM stops WHERE id IN (1,2,3,4,5);`);
    await queryRunner.query(`DELETE FROM transport_types WHERE id IN (1,2,3);`);
  }
}
