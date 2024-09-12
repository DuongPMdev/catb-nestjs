import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('statistic')
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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
