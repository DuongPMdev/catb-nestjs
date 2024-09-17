import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { PlaysHubConfigQuest } from './entity/plays-hub-config-quest.entity';
import { PlaysHubProgressQuest } from './entity/plays-hub-progress-quest.entity';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
// import * as TelegramBot from 'node-telegram-bot-api';
import { classToPlain } from 'class-transformer';

@Injectable()
export class PlaysHubService {

  // private telegramBot: TelegramBot;

  constructor(
    @InjectRepository(PlaysHubConfigQuest)
    private playsHubConfigQuestRepository: Repository<PlaysHubConfigQuest>,
    @InjectRepository(PlaysHubProgressQuest)
    private playsHubProgressQuestRepository: Repository<PlaysHubProgressQuest>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(GameCatBattleStatistic)
    private gameCatBattleStatisticRepository: Repository<GameCatBattleStatistic>,
  ) {
    // this.telegramBot = new TelegramBot('6410342407:AAEgV9Bz57DbEBTXkCLDw635ZNXfwy37QMI', { polling: true });
  }

  async getPlaysLeaderboard() {
    const currencies = await this.currencyRepository.find({ order: {plays: 'DESC'} });
    for (const currency of currencies) {
      let account = await this.accountRepository.findOne({ where: { account_id: currency.account_id } });
      currency["display_name"] = account.display_name;
    }
    return currencies;
  }

  async getPlaysHubQuestStatus(account_id: string) {
    const playsHubDataQuests: object[] = [];
    const playsHubConfigQuests = await this.playsHubConfigQuestRepository.find();
    
    for (const playsHubConfigQuest of playsHubConfigQuests) {
      let playsHubDataQuest = await this.getPlaysHubDataQuest(account_id, playsHubConfigQuest);
      playsHubDataQuests.push(playsHubDataQuest);
    }
    return { "data_quests": playsHubDataQuests };
  }

  async proceedPlaysHubQuest(account_id: string, type: string, request_type: string) {
    let playsHubProgressQuest = null;
    if (type === "DAILY") {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type: request_type, daily_date: Between(startOfDay, endOfDay) } });
      if (playsHubProgressQuest === null) {
        playsHubProgressQuest = new PlaysHubProgressQuest(account_id);
        playsHubProgressQuest.type = type;
        playsHubProgressQuest.request_type = request_type;
      }
    }
    else {
      playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type: request_type } });
      if (playsHubProgressQuest === null) {
        playsHubProgressQuest = new PlaysHubProgressQuest(account_id);
        playsHubProgressQuest.type = type;
        playsHubProgressQuest.request_type = request_type;
      }
    }

    let isProceeded = false;
    if (playsHubProgressQuest.request_type === "CHECK_IN_TON_WALLET") {
      isProceeded = false;
    }
    else if (playsHubProgressQuest.request_type === "PLAY_CAT_BATTLE") {
      const gameCatBattleStatistic = await this.gameCatBattleStatisticRepository.findOne({ where: { account_id: account_id } });
      if (gameCatBattleStatistic) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastLogin = new Date(gameCatBattleStatistic.last_login_datetime);
        lastLogin.setHours(0, 0, 0, 0);
        if (today === lastLogin) {
          isProceeded = true;
        }
      }
    }
    else if (playsHubProgressQuest.request_type === "INVITE") {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      const referralAccounts = await this.accountRepository.find({ where: { referral_id: account_id, created_datetime: Between(startOfDay, endOfDay) } });
      if (referralAccounts.length > 0) {
        isProceeded = true;
      }
    }
    else if (playsHubProgressQuest.request_type === "VISIT_PLAYS_COMMUNITY") {
      isProceeded = true;
    }
    else if (playsHubProgressQuest.request_type === "VISIT_OFFICIAL_WEBSITE") {
      isProceeded = true;
    }
    else if (playsHubProgressQuest.request_type === "COMPLETE_DAILY_TASK") {
      isProceeded = true;
    }
    else if (playsHubProgressQuest.request_type === "CONNECT_TON_WALLET") {
      isProceeded = false;
    }
    else if (playsHubProgressQuest.request_type === "JOIN_PLAYS_CHANNEL") {
      // const account = await this.accountRepository.findOne({ where: { account_id: account_id } });
      // const isMember = await this.checkIfUserIsMember("7210961345", +account.telegram_id);
      // if (isMember === true) {
      //   isProceeded = true;
      // }
    }
    else if (playsHubProgressQuest.request_type === "JOIN_PLAYS_CHAT") {
      // const account = await this.accountRepository.findOne({ where: { account_id: account_id } });
      // const isMember = await this.checkIfUserIsMember("1002202947161", +account.telegram_id);
      // if (isMember === true) {
      //   isProceeded = true;
      // }
    }
    else if (playsHubProgressQuest.request_type === "FOLLOW_PLAYS_ON_X") {
      isProceeded = true;
    }
    if (isProceeded === true) {
      playsHubProgressQuest.progress_amount++;
      await this.playsHubProgressQuestRepository.save(playsHubProgressQuest);
    }

    return { "is_proceeded": isProceeded};
  }

  async checkPlaysHubQuest(account_id: string, type: string, request_type: string) {
    if (request_type === "JOIN_PLAYS_CHANNEL" || request_type === "JOIN_PLAYS_CHAT" || request_type === "PLAY_CAT_BATTLE") {
      await this.proceedPlaysHubQuest(account_id, type, request_type);
    }
    const playsHubConfigQuest = await this.playsHubConfigQuestRepository.findOne({ where: { type: type, request_type: request_type } });
    if (playsHubConfigQuest) {
      let playsHubDataQuest = await this.getPlaysHubDataQuest(account_id, playsHubConfigQuest);
      let currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
      if (currency === null) {
        currency = new Currency(account_id);
      }
      if (playsHubDataQuest["rewarded_step"] === 0) {
        if (playsHubDataQuest["progress_amount"] >= playsHubDataQuest["request_amount"]) {
          playsHubDataQuest["rewarded_step"]++;
          let rewardItems = playsHubDataQuest["reward"].split(",");
          let rewardItem = rewardItems[0].split(":");
          let rewardItemType = rewardItem[0];
          let rewardItemValue = rewardItem[1];
          if (rewardItemType === "PLAYS") {
            currency.plays += +rewardItemValue;
          }

          await this.currencyRepository.save(currency);

          let playsHubProgressQuest = null;
          if (type === "DAILY") {
            const today = new Date();
            const startOfDay = new Date(today);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(today);
            endOfDay.setHours(23, 59, 59, 999);
            playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type: request_type, daily_date: Between(startOfDay, endOfDay) } });
          }
          else {
            playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type: request_type } });
          }
          playsHubProgressQuest.rewarded_step++;

          await this.playsHubProgressQuestRepository.save(playsHubProgressQuest);

          if (type === "DAILY" && request_type !== "COMPLETE_DAILY_TASK") {
            await this.proceedPlaysHubQuest(account_id, "DAILY", "COMPLETE_DAILY_TASK");
            const dailyPlaysHubConfigQuest = await this.playsHubConfigQuestRepository.findOne({ where: { type: "DAILY", request_type: "COMPLETE_DAILY_TASK" } });
            let dailyPlaysHubDataQuest = await this.getPlaysHubDataQuest(account_id, dailyPlaysHubConfigQuest);

            return { "plays": currency.plays, "data_quest": playsHubDataQuest, "daily_quest": dailyPlaysHubDataQuest};
          }

          return { "plays": currency.plays, "data_quest": playsHubDataQuest };
        }
      }
    }
    return {};
  }

  async getPlaysHubDataQuest(account_id: string, playsHubConfigQuest: PlaysHubConfigQuest) {
    const type = playsHubConfigQuest.type;
    const request_type = playsHubConfigQuest.request_type;
    let playsHubDataQuest = {
      "type": type,
      "request_type": request_type,
    };

    playsHubDataQuest["icon_name"] = playsHubConfigQuest.icon_name;
    playsHubDataQuest["description"] = playsHubConfigQuest.description;
    playsHubDataQuest["request_amount"] = playsHubConfigQuest.request_amount;
    playsHubDataQuest["reward"] = playsHubConfigQuest.reward;
    playsHubDataQuest["additional"] = playsHubConfigQuest.additional;
    if (type === "DAILY") {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      let playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type: request_type, daily_date: Between(startOfDay, endOfDay) } });
      if (playsHubProgressQuest === null) {
        playsHubProgressQuest = new PlaysHubProgressQuest(account_id);
      }
      playsHubDataQuest["progress_amount"] = playsHubProgressQuest.progress_amount;
      playsHubDataQuest["rewarded_step"] = playsHubProgressQuest.rewarded_step;
      playsHubDataQuest["daily_date"] = playsHubProgressQuest.daily_date;
    }
    else {
      let playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type: request_type } });
      if (playsHubProgressQuest === null) {
        playsHubProgressQuest = new PlaysHubProgressQuest(account_id);
      }
      playsHubDataQuest["progress_amount"] = playsHubProgressQuest.progress_amount;
      playsHubDataQuest["rewarded_step"] = playsHubProgressQuest.rewarded_step;
      playsHubDataQuest["daily_date"] = playsHubProgressQuest.daily_date;
    }

    return playsHubDataQuest;
  }

  // async checkIfUserIsMember(chatId: string, userId: number): Promise<boolean> {
  //   try {
  //     const chatMember = await this.telegramBot.getChatMember(chatId, userId);
  //     return chatMember.status === 'member' || chatMember.status === 'administrator' || chatMember.status === 'creator';
  //   }
  //   catch (error) {
  //     console.error('Error checking chat member status:', error);
  //     return false;
  //   }
  // }

}