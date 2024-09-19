import { ApiProperty } from '@nestjs/swagger';

export class ConnectWalletDTO {

  @ApiProperty({ example: '', description: 'Wallet address' })
  wallet_address: string;
  
}