import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '1894903459', description: 'Telegram ID' })
  telegram_id: string;
}