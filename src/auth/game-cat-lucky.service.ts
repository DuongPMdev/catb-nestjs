import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entity/currency.entity';
import { GameCatLuckyStatistic } from './entity/game-cat-lucky-statistic.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class GameCatLuckyService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
    @InjectRepository(GameCatLuckyStatistic)
    private gameCatLuckyStatisticRepository: Repository<GameCatLuckyStatistic>,
    @InjectRepository(GameCatBattleStatistic)
    private gameCatBattleStatisticRepository: Repository<GameCatBattleStatistic>,
  ) {}

  private itemType = ["GEM", "SHARD", "TON", "BNB", "PLAYS", "TICKET"];

  async getGameCatLuckyStatistic(account_id: string) {
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (finalGameCatLuckyStatistic == null) {
      finalGameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    return { "statistic": classToPlain(finalGameCatLuckyStatistic) };
  }

  async playGameCatLucky(account_id: string, stage: number) {
    let gameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    if (gameCatLuckyStatistic == null) {
      gameCatLuckyStatistic = new GameCatLuckyStatistic(account_id);
    }
    let forceUpdate = false;
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
            gameCatLuckyStatistic.collected_ton += +itemValue;
          }
          else if (itemType == "BNB") {
            gameCatLuckyStatistic.collected_bnb += +itemValue;
          }
          else if (itemType == "PLAYS") {
            gameCatLuckyStatistic.collected_plays += +itemValue;
          }
          else if (itemType == "TICKET") {
            gameCatLuckyStatistic.collected_ticket += +itemValue;
          }
          gameCatLuckyStatistic.stage++;
          gameCatLuckyStatistic.game_over = 0;
          gameCatLuckyStatistic.playing_on = 0;
          gameCatLuckyStatistic.play_on_ticket = 100 + gameCatLuckyStatistic.stage * 10;
          gameCatLuckyStatistic.current_stage_result = this.generateStageResult(gameCatLuckyStatistic.stage);
        }
      }
      else {
        gameCatLuckyStatistic.stage++;
        gameCatLuckyStatistic.playing_on = 0;
        gameCatLuckyStatistic.play_on_ticket = 100 + gameCatLuckyStatistic.stage * 10;
        gameCatLuckyStatistic.current_stage_result = this.generateStageResult(gameCatLuckyStatistic.stage);
      }
      await this.gameCatLuckyStatisticRepository.save(gameCatLuckyStatistic);
    }
    else {
      forceUpdate = true;
    }
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    return { "force_update": forceUpdate, "status": classToPlain(finalGameCatLuckyStatistic) };
  }
  

  generateStageResult(stage: number): string {
    let result = '';
    let gameoverIndex = Math.floor(Math.random() * 4);
    if (stage % 5 == 0) {
      gameoverIndex = -1;
    }
    for (let i = 0; i < 4; i++) {
      if (i == gameoverIndex) {
        result += "GAMEOVER:1";
      }
      else {
        const itemIndex = Math.floor(Math.random() * this.itemType.length);
        const itemType = this.itemType[itemIndex];
        let itemValue = 0;
        if (itemType == "GEM") {
          itemValue = 100;
        }
        else if (itemType == "SHARD") {
          itemValue = 50;
        }
        else if (itemType == "TON") {
          itemValue = 0.01;
        }
        else if (itemType == "BNB") {
          itemValue = 0.001;
        }
        else if (itemType == "PLAYS") {
          itemValue = 1;
        }
        else if (itemType == "TICKET") {
          itemValue = 10;
        }
        result += itemType + ":" + itemValue;
      }
      if (i < 3) {
        result += ",";
      }
    }
    
    return result;
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
    if (stage > 0 && stage == gameCatLuckyStatistic.stage) {
      if (gameCatLuckyStatistic.ticket >= gameCatLuckyStatistic.play_on_ticket) {
        gameCatLuckyStatistic.ticket -= gameCatLuckyStatistic.play_on_ticket;
        gameCatLuckyStatistic.game_over = 0;
        gameCatLuckyStatistic.playing_on = 1;
        await this.gameCatLuckyStatisticRepository.save(gameCatLuckyStatistic);
      }
    }
    else {
      forceUpdate = true;
    }
    let finalGameCatLuckyStatistic = await this.gameCatLuckyStatisticRepository.findOne({ where: { account_id: account_id } });
    return { "force_update": forceUpdate, "status": classToPlain(finalGameCatLuckyStatistic) };
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