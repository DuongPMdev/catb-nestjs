import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('plays_hub_config_quest')
export class PlaysHubConfigQuest {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  type: string;

  @Column()
  icon_name: string;

  @Column()
  description: string;

  @Column()
  request_type: string;

  @Column()
  request_amount: number;

  @Column()
  reward: string;

  @Column()
  additional: string;

}
