import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { Friend } from './entity/friend.entity';
import { GameCatLuckyStatistic } from './entity/game-cat-lucky-statistic.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(GameCatLuckyStatistic)
    private gameCatLuckyStatisticRepository: Repository<GameCatLuckyStatistic>,
    @InjectRepository(GameCatBattleStatistic)
    private gameCatBattleStatisticRepository: Repository<GameCatBattleStatistic>,
    private jwtService: JwtService,
  ) {}
  
  private readonly characters = 'abcdefghijklmnopqrstuvwxyz0123456789a';

  async validateAccount(loginDTO: LoginDTO): Promise<any> {
    const account = await this.accountRepository.findOne({ where: { telegram_id: loginDTO.telegram_id } });
    if (account) {
      await this.accountRepository.update({ telegram_id: loginDTO.telegram_id }, { display_name: loginDTO.display_name });
    }
    else {
      const referralAccount = await this.accountRepository.findOne({ where: { account_id: loginDTO.referral_id } });
      if (referralAccount === null) {
        loginDTO.referral_id = "";
      }
      let account_id = this.generateAccountID(8);
      const newAccount = this.accountRepository.create({
        telegram_id: loginDTO.telegram_id,
        account_id: account_id,
        referral_id: loginDTO.referral_id,
        display_name: loginDTO.display_name,
        language_code: loginDTO.language_code,
        avatar: 0,
        platform: loginDTO.platform
      });
      await this.accountRepository.save(newAccount);

      if (referralAccount) {
        let friend = new Friend(referralAccount.account_id, account_id, referralAccount.display_name, loginDTO.display_name, 1, 1);
        await this.friendRepository.save(friend);
      }
    }
    const finalAccount = await this.accountRepository.findOne({ where: { telegram_id: loginDTO.telegram_id } });
    return finalAccount;
  }

  generateAccountID(length: number): string {
    let result = '';
    const charactersLength = this.characters.length;
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += this.characters.charAt(randomIndex);
    }
    
    return result;
  }

  async login(account: any) {
    const payload = { account_id: account.account_id, telegram_id: account.telegram_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getFriendsByAccountID(account_id: string) {
    const friends: object[] = [];
    const requestedFiends = await this.friendRepository.find({ where: [ { request_id: account_id } ] });
    const responseFiends = await this.friendRepository.find({ where: [ { response_id: account_id } ] });
    
    for (const requestedFriend of requestedFiends) {
      const currency = await this.getCurrencyByAccountID(requestedFriend.response_id);
      let fiend = {
        "account_id": requestedFriend.response_id,
        "display_name": requestedFriend.response_display_name,
        "status": requestedFriend.status,
        "by_referral": requestedFriend.by_referral,
        "created_datetime": requestedFriend.created_datetime,
        "plays": currency.plays,
      };
      friends.push(fiend);
    }
    for (const responseFiend of responseFiends) {
      const currency = await this.getCurrencyByAccountID(responseFiend.response_id);
      let fiend = {
        "account_id": responseFiend.request_id,
        "display_name": responseFiend.request_display_name,
        "status": responseFiend.status,
        "by_referral": responseFiend.by_referral,
        "created_datetime": responseFiend.created_datetime,
        "plays": currency.plays,
      };
      friends.push(fiend);
    }

    return friends;
  }

  async getAccountByTelegramID(telegram_id: string) {
    return await this.accountRepository.findOne({ where: { telegram_id: telegram_id } });
  }

  async getCurrencyByAccountID(account_id: string) {
    let currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
    if (currency == null) {
      currency = new Currency(account_id);
    }
    return currency;
  }

  async connectWalletByAccountID(account_id: string, wallet_address: string) {
    let currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
    if (currency == null) {
      currency = new Currency(account_id);
    }
    currency.wallet_address = wallet_address;
    
    return await this.currencyRepository.save(currency);;
  }

  async getGameCatLuckyStatisticByAccountID(account_id: string) {
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    return gameCatLuckyStatistic;
  }

  async getGameCatBattleStatisticByAccountID(account_id: string) {
    let gameCatBattleStatistic = await this.gameCatBattleStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatBattleStatistic == null) {
      gameCatBattleStatistic = new GameCatBattleStatistic(account_id);
    }
    return gameCatBattleStatistic;
  }

}