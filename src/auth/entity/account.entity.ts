import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('account_test')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegram_id: string;
  
  @Column({ unique: true })
  @Exclude()
  account_id: string;

  @Column()
  display_name: string;
}
