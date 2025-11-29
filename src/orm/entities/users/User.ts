import bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { Complaint } from '../transit/Complaint';
import { Fine } from '../transit/Fine';
import { TransportCard } from '../transit/TransportCard';
import { UserGpsLog } from '../transit/UserGpsLog';

import { Role, Language } from './types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    length: 100,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
    unique: true,
    length: 40,
  })
  username: string;

  @Column({
    nullable: true,
    length: 40,
  })
  name: string;

  @Column({
    nullable: true,
    unique: true,
  })
  phone: string;

  @Column({
    name: 'full_name',
    nullable: true,
  })
  fullName: string;

  @Column({
    name: 'registered_at',
    type: 'timestamp without time zone',
    nullable: true,
    default: () => 'now()',
  })
  registeredAt: Date;

  @Column({
    default: 'STANDARD' as Role,
    length: 30,
  })
  role: Role;

  @Column({
    default: 'en-US' as Language,
    length: 15,
  })
  language: string;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => TransportCard, (card) => card.user)
  transportCard?: TransportCard;

  @OneToMany(() => Complaint, (complaint) => complaint.user)
  complaints?: Complaint[];

  @OneToMany(() => Fine, (fine) => fine.user)
  fines?: Fine[];

  @OneToMany(() => UserGpsLog, (log) => log.user)
  gpsLogs?: UserGpsLog[];

  setLanguage(language: Language) {
    this.language = language;
  }

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
