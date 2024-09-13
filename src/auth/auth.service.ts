import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    private jwtService: JwtService,
  ) {}

  async validateAccount(loginDTO: LoginDTO): Promise<any> {
    const account = await this.accountRepository.findOne({ where: { telegram_id: loginDTO.telegram_id } });
    if (account) {
      const updatedAccount = await this.accountRepository.update({ telegram_id: loginDTO.telegram_id }, { display_name: loginDTO.display_name, last_login: new Date() });
      return updatedAccount;
    }
    else {
      var account_id = "";
      const newAccount = this.accountRepository.create({
        telegram_id: loginDTO.telegram_id,
        account_id: account_id,
        referral_id: loginDTO.referral_id,
        display_name: loginDTO.display_name,
        language_code: loginDTO.language_code,
        avatar: 0,
        platform: loginDTO.platform
      });
      return this.accountRepository.save(newAccount);
    }
  }

  async login(account: any) {
    console.log("login account_id : " + account.account_id);
    console.log("login telegram_id : " + account.telegram_id);
    const payload = { account_id: account.account_id, telegram_id: account.telegram_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getAccountByTelegramID(telegram_id: string) {
    return await this.accountRepository.findOne({ where: { telegram_id: telegram_id } });
  }

  async getCurrencyByAccountID(account_id: string) {
    var currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
    if (currency == null) {
      currency = new Currency(account_id);
    }
    return currency;
  }

}