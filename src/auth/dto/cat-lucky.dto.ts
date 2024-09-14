import { ApiProperty } from '@nestjs/swagger';

export class CatLuckyDTO {
  @ApiProperty({ example: '0', description: 'stage' })
  stage: number;
}