import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('game_cat_battle_statistic')
export class GameCatBattleStatistic {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  account_id: string;

  @Column()
  gem: number;

  @Column()
  shard: number;

  @Column()
  last_login_datetime: Date;

  constructor(account_id: string) {
    this.account_id = account_id;
    this.gem = 0;
    this.shard = 0;
  }

}
