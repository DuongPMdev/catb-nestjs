import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  username: string;

  password: string;
}