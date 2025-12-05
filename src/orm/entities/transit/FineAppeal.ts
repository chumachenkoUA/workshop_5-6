import { Check, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Fine } from './Fine';

@Check('fine_appeals_status_check', "\"status\" IN ('Подано','Перевіряється','Відхилено','Прийнято')")
@Unique('fine_appeals_fine_unique', ['fine'])
@Entity({ name: 'fine_appeals' })
export class FineAppeal {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @OneToOne(() => Fine, (fine) => fine.appeal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fine_id' })
  fine: Fine;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'text' })
  status: string;

  @Column({ name: 'created_at', type: 'timestamp without time zone', default: () => 'now()' })
  createdAt: Date;
}
