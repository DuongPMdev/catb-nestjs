import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account_test')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegram_id: string;

  @Column()
  display_name: string;
}
