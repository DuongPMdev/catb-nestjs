import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('game_cat_lucky_config_leaderboard_reward')
export class GameCatLuckyConfigLeaderboardReward {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  request: number;

  @Column()
  reward: string;

}
