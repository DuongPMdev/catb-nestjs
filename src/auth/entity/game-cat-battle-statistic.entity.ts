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
  last_login_datetime: Date;

}
