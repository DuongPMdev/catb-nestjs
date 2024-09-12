import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    private jwtService: JwtService,
  ) {}

  async validateAccount(loginDto: LoginDto): Promise<any> {
    const account = await this.accountRepository.findOne({ where: { telegram_id: loginDto.telegram_id } });
    if (account) {
      const { ...result } = account;
      return result;
    }
    else {
      var account_id = "";
      const user = this.accountRepository.create({
        telegram_id: loginDto.telegram_id,
        account_id: account_id,
        display_name: loginDto.display_name,
        avatar: 0,
        platform: loginDto.platform
      });
      return this.accountRepository.save(user);
    }
    return null;
  }

  async login(account: any) {
    const payload = { telegram_id: account.telegram_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAccountByTelegramID(telegram_id: string) {
    return await this.accountRepository.findOne({ where: { telegram_id: telegram_id } });
  }

  async getCurrencyByAccountID(account_id: string) {
    return await this.currencyRepository.findOne({ where: { account_id: account_id } });
  }

}