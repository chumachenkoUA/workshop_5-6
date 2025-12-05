import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { DriverAssignment } from './DriverAssignment';
import { Trip } from './Trip';

@Unique('drivers_email_unique', ['email'])
@Unique('drivers_phone_unique', ['phone'])
@Unique('drivers_license_unique', ['licenseData'])
@Entity({ name: 'drivers' })
export class Driver {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  phone: string;

  @Column({ name: 'full_name', type: 'text' })
  fullName: string;

  @Column({ name: 'license_data', type: 'text' })
  licenseData: string;

  @Column({ name: 'passport_data', type: 'jsonb' })
  passportData: Record<string, unknown>;

  @OneToMany(() => DriverAssignment, (assignment) => assignment.driver)
  assignments?: DriverAssignment[];

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips?: Trip[];
}
