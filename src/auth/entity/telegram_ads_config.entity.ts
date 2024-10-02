import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('telegram_ads_config')
export class TelegramAdsConfig {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  key: string;

  @Column()
  game: string;

  @Column()
  type: string;

  @Column()
  block_id: string;

}
