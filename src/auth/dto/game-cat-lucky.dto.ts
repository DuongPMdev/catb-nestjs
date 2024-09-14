import { ApiProperty } from '@nestjs/swagger';

export class GameCatLuckyDTO {
  @ApiProperty({ example: '0', description: 'stage' })
  stage: number;
}