import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('transaction')
export class Transaction {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column({ unique: true })
  account_id: string;
  
  @Column('double')
  time_stamp: number;
  
  @Column()
  total_fees: string;
  
  @Column()
  source: string;
  
  @Column()
  destination: string;
  
  @Column('double')
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_datetime: Date;

}
