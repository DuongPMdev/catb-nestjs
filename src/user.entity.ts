import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('account_test')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @Column()
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  telegram_id: string;

  @Column()
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  account_id: string;

  @Column()
  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  display_name: string;
}
