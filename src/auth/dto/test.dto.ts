import { ApiProperty } from '@nestjs/swagger';

export class TestDto {
  @ApiProperty({ example: 'aaaaaaaa', description: 'Username of the user aaaaaa' })
  username: string;

  @ApiProperty({ example: 'aaaaaaaaaa', description: 'Password of the user aaaaaa' })
  password: string;
}