import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('plays_hub_progress_quest')
export class PlaysHubProgressQuest {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  account_id: string;

  @Column()
  type: string;

  @Column()
  request_type: string;

  @Column()
  progress_amount: number;

  @Column()
  rewarded_step: number;

  @Column()
  daily_date: Date;
  
  constructor(account_id: string) {
    this.id = 0;
    this.account_id = account_id;
    this.type = "";
    this.request_type = "";
    this.progress_amount = 0;
    this.rewarded_step = 0;
    this.daily_date = new Date();
  }

}
