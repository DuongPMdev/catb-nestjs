import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entity/account.entity';
import { Statistic } from './entity/statistic.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Statistic)
    private statisticRepository: Repository<Statistic>,
    private jwtService: JwtService,
  ) {}

  async validateAccountByTelegramID(telegram_id: string): Promise<any> {
    const account = await this.accountRepository.findOne({ where: { telegram_id } });
    if (account) {
      const { ...result } = account;
      return result;
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

  async getStatisticByAccountID(account_id: string) {
    return await this.statisticRepository.findOne({ where: { account_id: account_id } });
  }

}