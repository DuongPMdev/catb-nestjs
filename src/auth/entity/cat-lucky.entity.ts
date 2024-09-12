import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('cat_lucky')
export class CatLucky {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  account_id: string;

  @Column()
  stage: number;

  @Column()
  current_stage_result: string;

  @Column()
  collected_gem: number;

  @Column()
  collected_shard: number;

  @Column()
  collected_ton: number;

  @Column()
  collected_star: number;

  @Column()
  collected_bnb: number;

  @Column()
  collected_plays: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lock_until: Date;
  
  constructor(account_id: string) {
    this.id = 0;
    this.account_id = account_id;
    this.stage = 0;
    this.current_stage_result = "";
    this.collected_gem = 0;
    this.collected_shard = 0;
    this.collected_ton = 0;
    this.collected_star = 0;
    this.collected_bnb = 0;
    this.collected_plays = 0;
    this.lock_until = new Date();
  }

}
