import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('game_cat_lucky_config_shop')
export class GameCatLuckyConfigShop {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  request_type: string;

  @Column('float')
  request_amount: number;

  @Column()
  value_type: string;

  @Column()
  value_amount: number;

  @Column()
  icon: string;

  @Column()
  group: string;

  @Column('float')
  discount: number;

  @Column()
  discount_until: Date;

}
