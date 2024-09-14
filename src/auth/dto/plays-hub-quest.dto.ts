import { ApiProperty } from '@nestjs/swagger';

export class PlaysHubQuestDTO {
  @ApiProperty({ example: '', description: 'Quest type' })
  type: string;

  @ApiProperty({ example: '', description: 'Quest request type' })
  request_type: string;
}