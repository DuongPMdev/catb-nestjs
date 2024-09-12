import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('currency')
export class Currency {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  account_id: string;

  @Column()
  ton: number;

  @Column()
  bnb: number;

  @Column()
  plays: number;

}
