import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('account')
export class Account {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  telegram_id: string;

  @Column({ unique: true })
  @Exclude()
  device_id: string;

  @Column({ unique: true })
  @Exclude()
  custom_login_id: string;
  
  @Column({ unique: true })
  account_id: string;
  
  @Column({ unique: true })
  referral_id: string;
  
  @Column()
  @Exclude()
  custom_password: string;

  @Column()
  display_name: string;

  @Column()
  language_code: string;

  @Column()
  avatar: number;

  @Column()
  platform: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_login: Date;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_logout: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_datetime: Date;

}
