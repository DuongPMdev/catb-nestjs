import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('friend')
export class Friend {

  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column()
  request_id: string;

  @Column()
  response_id: string;

  @Column()
  request_display_name: string;

  @Column()
  response_display_name: string;

  @Column()
  status: number;

  @Column()
  by_referral: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_datetime: Date;

  constructor(request_id: string, response_id: string, request_display_name: string, response_display_name: string, status: number, by_referral: number) {
    this.id = 0;
    this.request_id = request_id;
    this.response_id = response_id;
    this.request_display_name = request_display_name;
    this.response_display_name = response_display_name;
    this.status = status;
    this.by_referral = by_referral;
    this.created_datetime = new Date();
  }

}
