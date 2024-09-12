import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: '1894903459', description: 'Telegram ID' })
  telegram_id: string;

  @ApiProperty({ example: '', description: 'Device ID' })
  device_id: string;
  
  @ApiProperty({ example: '', description: 'Custom login ID' })
  custom_login_id: string;

  @ApiProperty({ example: '', description: 'Referral Telegram ID' })
  referral_id: string;

  @ApiProperty({ example: 'Display Name', description: 'Display Name' })
  display_name: string;

  @ApiProperty({ example: 'en', description: 'Language Code' })
  language_code: string;

  @ApiProperty({ example: 'ios', description: 'Playform' })
  platform: string;
}