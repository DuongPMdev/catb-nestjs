import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('game_cat_lucky_time_locker')
export class GameCatLuckyTimeLocker {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  account_id: string;

  @Column()
  index_lock_ads: number;
  
  @Column()
  lock_ads: Date;
  
  constructor(account_id: string) {
    this.id = 0;
    this.account_id = account_id;
    this.index_lock_ads = 0;
    this.lock_ads = new Date();
  }

}
