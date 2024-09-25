import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { GameCatLuckyStatistic } from './entity/game-cat-lucky-statistic.entity';
import { GameCatLuckyConfigShop } from './entity/game-cat-lucky-config-shop.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { classToPlain } from 'class-transformer';
import { Cron } from '@nestjs/schedule';
import * as cronParser from 'cron-parser';

@Injectable()
export class GameCatLuckyService {

  private cronExpression = '0 * * * *';  // Every minute
  
  private rewardRate = "GEM:20|SHARD:20|TICKET:30|PLAYS:35|TON:5|BNB:0";
  private gameOver = "START:10|RATE_PERCENT:15|RATE_EACH_LEVEL:5|BONUS:5|MAX:80";
  private GEM = "START:10|BONUS:5|BASE_MULTIPLIER:1.1|BONUS_MULTIPLIER:1.05|MIN_FACTOR:0.9|MAX_FACTOR:1.1";
  private SHARD = "START:5|BONUS:5|BASE_MULTIPLIER:1.1|BONUS_MULTIPLIER:1.05|MIN_FACTOR:0.9|MAX_FACTOR:1.1";
  private TICKET = "START:2|BONUS:5|BASE_MULTIPLIER:1.1|BONUS_MULTIPLIER:1.05|MIN_FACTOR:0.9|MAX_FACTOR:1.1";
  private PLAYS = "START:10|BONUS:5|BASE_MULTIPLIER:1.1|BONUS_MULTIPLIER:1.05|MIN_FACTOR:0.9|MAX_FACTOR:1.1";
  private TON = "START:0.01|BONUS:5|BASE_MULTIPLIER:1.1|BONUS_MULTIPLIER:1.02|MIN_FACTOR:0.9|MAX_FACTOR:1.1";
  private BNB = "START:0.001|BONUS:5|BASE_MULTIPLIER:1.1|BONUS_MULTIPLIER:1.02|MIN_FACTOR:0.9|MAX_FACTOR:1.1";

  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(GameCatLuckyStatistic)
    private gameCatLuckyStatisticRepository: Repository<GameCatLuckyStatistic>,
    @InjectRepository(GameCatLuckyConfigShop)
    private gameCatLuckyConfigShopRepository: Repository<GameCatLuckyConfigShop>,
    @InjectRepository(GameCatBattleStatistic)
    private gameCatBattleStatisticRepository: Repository<GameCatBattleStatistic>,
  ) {}

  @Cron('0 * * * *')  // CRON expression: every hour
  async autoIncreaseTicketPerMinute() {
    try {
      await this.gameCatLuckyStatisticRepository.createQueryBuilder()
      .update(GameCatLuckyStatistic)
      .set({ ticket: () => 'ticket + 1',})
      .where('ticket < max_ticket')
      .execute();
    }
    catch (error) {
      console.error('Failed to increment coins:', error);
    }
  }

  getSecondsUntilNextExecution(): number {
    const now = new Date();
    const interval = cronParser.parseExpression(this.cronExpression, { currentDate: now });
    const nextFire = interval.next().toDate();

    // Calculate the difference in seconds
    const diffInSeconds = Math.floor((nextFire.getTime() - now.getTime()) / 1000);
    return diffInSeconds;
  }

  async getGameCatLuckyTicket(account_id: string) {
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (finalGameCatLuckyStatistic == null) {
      finalGameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    return { "ticket": finalGameCatLuckyStatistic.ticket };
  }

  async getGameCatLuckyConfigShops() {
    let finalGameCatLuckyConfigShops = await this.gameCatLuckyConfigShopRepository.find();
    for (const finalGameCatLuckyConfigShop of finalGameCatLuckyConfigShops) {
      if (finalGameCatLuckyConfigShop.request_type === "USD") {
        finalGameCatLuckyConfigShop["usd"] = finalGameCatLuckyConfigShop.request_amount;
        finalGameCatLuckyConfigShop["ton"] = finalGameCatLuckyConfigShop.request_amount / 5.0;
        finalGameCatLuckyConfigShop["bnb"] = finalGameCatLuckyConfigShop.request_amount / 550.0;
      }
    }
    return finalGameCatLuckyConfigShops;
  }

  async getPlayedPointLeaderboard() {
    const gameCatLuckyStatistics = await this.gameCatLuckyStatisticRepository.find({ order: { played_point: 'DESC' }, where: { played_point: MoreThan(0) }, take: 100 });

    let playedPointLeaderboard = [];
    for (const gameCatLuckyStatistic of gameCatLuckyStatistics) {
      let account = await this.accountRepository.findOne({ where: { account_id: gameCatLuckyStatistic.account_id } });
      let record = {
        "display_name": account.display_name,
        "played_point": gameCatLuckyStatistic.played_point,
      };
      playedPointLeaderboard.push(record);
    }

    return playedPointLeaderboard;
  }

  async getPlayedPointLeaderboardPosition(account_id: string) {
    const query = `
      SELECT * FROM (
        SELECT account_id, played_point, RANK() OVER (ORDER BY played_point DESC) AS played_point_rank
        FROM game_cat_lucky_statistic
      ) AS ranked_users
      WHERE account_id = ?;
    `;
    const result = await this.currencyRepository.query(query, [account_id]);
    if (result.length > 0) {
      if (result[0].played_point > 0) {
        return result[0];
      }
    }
    return null;
  }

  async getGameCatLuckySecondToFreeTicket() {
    let seconds = this.getSecondsUntilNextExecution();
    seconds += +3;
    return { "second": seconds };
  }

  async getGameCatLuckyStatistic(account_id: string) {
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (finalGameCatLuckyStatistic == null) {
      finalGameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    finalGameCatLuckyStatistic.last_play_datetime = new Date();
    this.gameCatLuckyStatisticRepository.save(finalGameCatLuckyStatistic);
    return classToPlain(finalGameCatLuckyStatistic);
  }

  async playGameCatLucky(account_id: string, stage: number) {
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    let forceUpdate = false;
    let isNotEnoughTicket = false;
    if (stage == gameCatLuckyStatistic.stage) {
      if (gameCatLuckyStatistic.current_stage_result != "") {
        const items = gameCatLuckyStatistic.current_stage_result.split(",");
        const selectedItem = items[gameCatLuckyStatistic.playing_on];
        const itemDetail = selectedItem.split(":");
        const itemType = itemDetail[0];
        const itemValue = itemDetail[1];
        if (itemType == "GAMEOVER") {
          gameCatLuckyStatistic.game_over = 1;
        }
        else {
          if (itemType == "GEM") {
            gameCatLuckyStatistic.collected_gem += +itemValue;
          }
          else if (itemType == "SHARD") {
            gameCatLuckyStatistic.collected_shard += +itemValue;
          }
          else if (itemType == "TON") {
            gameCatLuckyStatistic.collected_ton += parseFloat(itemValue);
          }
          else if (itemType == "BNB") {
            gameCatLuckyStatistic.collected_bnb += parseFloat(itemValue);
          }
          else if (itemType == "PLAYS") {
            gameCatLuckyStatistic.collected_plays += parseFloat(itemValue);
          }
          else if (itemType == "TICKET") {
            gameCatLuckyStatistic.collected_ticket += +itemValue;
          }
          gameCatLuckyStatistic.played_point += gameCatLuckyStatistic.stage;
          gameCatLuckyStatistic.stage++;
          gameCatLuckyStatistic.game_over = 0;
          gameCatLuckyStatistic.playing_on = 0;
          gameCatLuckyStatistic.play_on_ticket = 10 + gameCatLuckyStatistic.stage;
          gameCatLuckyStatistic.current_stage_result = this.generateStageResult(gameCatLuckyStatistic.stage);
        }
      }
      else {
        gameCatLuckyStatistic.play_on_ticket = 10 + gameCatLuckyStatistic.stage;
        if (gameCatLuckyStatistic.ticket >= gameCatLuckyStatistic.play_on_ticket) {
          gameCatLuckyStatistic.played_point += gameCatLuckyStatistic.stage;
          gameCatLuckyStatistic.stage++;
          gameCatLuckyStatistic.ticket -= gameCatLuckyStatistic.play_on_ticket;
          gameCatLuckyStatistic.playing_on = 0;
          gameCatLuckyStatistic.current_stage_result = this.generateStageResult(gameCatLuckyStatistic.stage);
        }
        else {
          isNotEnoughTicket = true;
        }
      }
      await this.gameCatLuckyStatisticRepository.save(gameCatLuckyStatistic);
    }
    else {
      forceUpdate = true;
    }
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    return { "is_not_enough_ticket": isNotEnoughTicket, "force_update": forceUpdate, "status": classToPlain(finalGameCatLuckyStatistic) };
  }
  
  generateStageResult(stage: number): string {
    let result = '';

    let hasGameOver = false;
    const gameOverConfigs = this.parseConfig(this.gameOver);
    const isBonusLevel = stage % gameOverConfigs[3] === 0;

    if (isBonusLevel || stage === 0 || stage === 1) {
      result = this.getRandomReward(stage);
    } else {
      let gameOverRate = gameOverConfigs[0] + gameOverConfigs[1] * Math.floor(stage / gameOverConfigs[2]);
      if (gameOverRate > gameOverConfigs[4]) {
        gameOverRate = gameOverConfigs[4]; // max rate
      }

      const random = this.getRandomInt(1, 101);
      if (random <= gameOverRate) {
        result = 'GAMEOVER:1';
        hasGameOver = true;
      } else {
        result = this.getRandomReward(stage);
      }
    }

    const maxFake = 3;
    for (let i = 0; i < maxFake; i++) {
      if (hasGameOver) {
        result += ',' + this.getRandomReward(stage, true);
      } else {
        let gameOverRate = gameOverConfigs[0] + gameOverConfigs[1] * Math.floor(stage / gameOverConfigs[2]);
        if (gameOverRate > gameOverConfigs[4]) {
          gameOverRate = gameOverConfigs[4];
        }

        const random = this.getRandomInt(1, 101);
        const isNotHaveGameOverCard = isBonusLevel || stage === 0 || stage === 1;

        if (random <= gameOverRate && !isNotHaveGameOverCard) {
          result += ',GAMEOVER:1';
          hasGameOver = true;
        } else {
          result += ',' + this.getRandomReward(stage, true);
        }
      }
    }

    return result;
  }

  getRandomReward(stage: number, isFake = false): string {
    let rewardType = 'GEM';
    let rewardConfig = this.GEM;

    const rewardRates = this.rewardRate.split('|');
    for (let i = rewardRates.length - 1; i >= 0; i--) {
      const [type, rateStr] = rewardRates[i].split(':');
      const rate = parseFloat(rateStr);
      if (rate === 0) continue;

      const random = this.getRandomInt(1, 101);
      if (random <= rate) {
        rewardType = type;
        rewardConfig = this.getRewardConfig(type);
        break;
      }
    }

    const configs = this.parseConfig(rewardConfig);
    let rewardValue = configs[0] * Math.pow(configs[2], stage);

    const isBonusLevel = stage % configs[1] === 0;
    if (stage !== 0 && isBonusLevel) {
      rewardValue *= Math.pow(configs[3], stage);
    }

    const factor = isFake
      ? this.getRandomFloat(0.8, 1.2)
      : this.getRandomFloat(configs[4], configs[5]);

    rewardValue *= factor;

    if (['TON', 'BNB'].includes(rewardType)) {
      return `${rewardType}:${rewardValue.toFixed(3)}`;
    } else {
      return `${rewardType}:${Math.floor(rewardValue)}`;
    }
  }

  parseConfig(configStr: string): number[] {
    return configStr.split('|').map(str => parseFloat(str.split(':')[1]));
  }

  getRewardConfig(type: string): string {
    switch (type) {
      case 'SHARD': return this.SHARD;
      case 'TICKET': return this.TICKET;
      case 'PLAYS': return this.PLAYS;
      case 'TON': return this.TON;
      case 'BNB': return this.BNB;
      default: return this.GEM;
    }
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getRandomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  async finishGameCatLucky(account_id: string, stage: number) {
    let currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
    if (currency == null) {
      currency = new Currency(account_id);
    }
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    let gameCatBattleStatistic = await this.gameCatBattleStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatBattleStatistic == null) {
      gameCatBattleStatistic = new GameCatBattleStatistic(account_id);
    }
    
    let forceUpdate = false;
    if (stage > 0 && stage == gameCatLuckyStatistic.stage) {
      currency.ton += gameCatLuckyStatistic.collected_ton;
      currency.bnb += gameCatLuckyStatistic.collected_bnb;
      currency.plays += gameCatLuckyStatistic.collected_plays;
      gameCatLuckyStatistic.ticket += gameCatLuckyStatistic.collected_ticket;
      gameCatBattleStatistic.gem += gameCatLuckyStatistic.collected_gem;
      gameCatBattleStatistic.shard += gameCatLuckyStatistic.collected_shard;

      gameCatLuckyStatistic.game_over = 0;
      gameCatLuckyStatistic.stage = 0;
      gameCatLuckyStatistic.play_on_ticket = 10 + gameCatLuckyStatistic.stage;
      gameCatLuckyStatistic.current_stage_result = "";
      gameCatLuckyStatistic.collected_gem = 0;
      gameCatLuckyStatistic.collected_shard = 0;
      gameCatLuckyStatistic.collected_ton = 0;
      gameCatLuckyStatistic.collected_bnb = 0;
      gameCatLuckyStatistic.collected_plays = 0;
      gameCatLuckyStatistic.collected_ticket = 0;

      await this.currencyRepository.save(currency);
      await this.gameCatBattleStatisticRepository.save(gameCatBattleStatistic);
      await this.gameCatLuckyStatisticRepository.save(gameCatLuckyStatistic);
    }
    else {
      forceUpdate = true;
    }
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    return { "force_update": forceUpdate, "status": classToPlain(finalGameCatLuckyStatistic) };
  }

  async playOnGameCatLucky(account_id: string, stage: number) {
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    let forceUpdate = false;
    let isNotEnoughTicket = false;
    if (stage > 0 && stage == gameCatLuckyStatistic.stage) {
      if (gameCatLuckyStatistic.ticket >= gameCatLuckyStatistic.play_on_ticket) {
        gameCatLuckyStatistic.ticket -= gameCatLuckyStatistic.play_on_ticket;
        gameCatLuckyStatistic.game_over = 0;
        gameCatLuckyStatistic.playing_on = 1;
        await this.gameCatLuckyStatisticRepository.save(gameCatLuckyStatistic);
      }
      else {
        isNotEnoughTicket = true;
      }
    }
    else {
      forceUpdate = true;
    }
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    return { "is_not_enough_ticket": isNotEnoughTicket, "force_update": forceUpdate, "status": classToPlain(finalGameCatLuckyStatistic) };
  }

  async giveUpGameCatLucky(account_id: string, stage: number) {
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    let forceUpdate = false;
    if (stage > 0 && stage == gameCatLuckyStatistic.stage) {
      gameCatLuckyStatistic.game_over = 0;
      gameCatLuckyStatistic.stage = 0;
      gameCatLuckyStatistic.play_on_ticket = 10 + gameCatLuckyStatistic.stage;
      gameCatLuckyStatistic.current_stage_result = "";
      gameCatLuckyStatistic.collected_gem = 0;
      gameCatLuckyStatistic.collected_shard = 0;
      gameCatLuckyStatistic.collected_ton = 0;
      gameCatLuckyStatistic.collected_bnb = 0;
      gameCatLuckyStatistic.collected_plays = 0;
      gameCatLuckyStatistic.collected_ticket = 0;
      await this.gameCatLuckyStatisticRepository.save(gameCatLuckyStatistic);
    }
    else {
      forceUpdate = true;
    }
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    return { "force_update": forceUpdate, "status": classToPlain(finalGameCatLuckyStatistic) };
  }

}