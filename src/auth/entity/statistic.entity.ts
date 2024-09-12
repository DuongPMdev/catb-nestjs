import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('statistic_test')
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Exclude()
  account_id: string;

  @Column()
  coin: number;

  @Column()
  gem: number;

  @Column()
  fragment: number;

  @Column()
  ton: number;

  @Column()
  bnb: number;

  @Column()
  plays: number;
}
