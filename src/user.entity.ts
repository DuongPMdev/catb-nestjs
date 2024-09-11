import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({ example: 1, description: 'The ID of the user' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  telegram_id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  account_id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
  display_name: string;
}
