import { ApiProperty } from '@nestjs/swagger';

export class SDKQuestDTO {
  @ApiProperty({ example: '', description: 'Quest type' })
  game_id: string;

  @ApiProperty({ example: '', description: 'Quest type' })
  type: string;

  @ApiProperty({ example: '', description: 'Quest request type' })
  request_type: string;
}