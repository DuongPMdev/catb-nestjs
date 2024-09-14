import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CatLucky } from './entity/cat-lucky.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class CatLuckyService {
  constructor(
    @InjectRepository(CatLucky)
    private catLuckyRepository: Repository<CatLucky>,
    private jwtService: JwtService,
  ) {}

  private itemType = ["GEM", "SHARD", "TON", "STAR", "BNB", "PLAYS", "TICKET"];

  async getCatLuckyStatus(account_id: string) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    return { "status": classToPlain(catLucky) };
  }

  async playCatLucky(account_id: string, stage: number) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    var forceUpdate = false;
    if (stage == catLucky.stage) {
      if (catLucky.current_stage_result != "") {
        const items = catLucky.current_stage_result.split(",");
        const firstItem = items[0];
        const itemDetail = firstItem.split(":");
        const itemType = itemDetail[0];
        const itemValue = itemDetail[1];
        if (itemType == "GAMEOVER") {
          catLucky.stage = 0;
          catLucky.current_stage_result = "";
          catLucky.collected_gem = 0;
          catLucky.collected_shard = 0;
          catLucky.collected_ton = 0;
          catLucky.collected_star = 0;
          catLucky.collected_bnb = 0;
          catLucky.collected_plays = 0;
          catLucky.collected_ticket = 0;
        }
        else {
          if (itemType == "GEM") {
            catLucky.collected_gem += +itemValue;
          }
          else if (itemType == "SHARD") {
            catLucky.collected_shard += +itemValue;
          }
          else if (itemType == "TON") {
            catLucky.collected_ton += +itemValue;
          }
          else if (itemType == "STAR") {
            catLucky.collected_star += +itemValue;
          }
          else if (itemType == "BNB") {
            catLucky.collected_bnb += +itemValue;
          }
          else if (itemType == "PLAYS") {
            catLucky.collected_plays += +itemValue;
          }
          else if (itemType == "TICKET") {
            catLucky.collected_ticket += +itemValue;
          }
          catLucky.stage++;
          catLucky.current_stage_result = this.generateStageResult(catLucky.stage);
        }
      }
      else {
        catLucky.stage++;
        catLucky.current_stage_result = this.generateStageResult(catLucky.stage);
      }
      await this.catLuckyRepository.save(catLucky);
    }
    else {
      forceUpdate = true;
    }
    var finalCatLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    return { "force_update": forceUpdate, "status": classToPlain(finalCatLucky) };
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
        var itemValue = 0;
        if (itemType == "GEM") {
          itemValue = 100;
        }
        else if (itemType == "SHARD") {
          itemValue = 50;
        }
        else if (itemType == "TON") {
          itemValue = 0.01;
        }
        else if (itemType == "STAR") {
          itemValue = 10;
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

  async finishCatLucky(account_id: string, stage: number) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    var forceUpdate = false;
    if (stage > 0 && stage == catLucky.stage) {
      catLucky.ticket += catLucky.collected_ticket;
      catLucky.stage = 0;
      catLucky.current_stage_result = "";
      catLucky.collected_gem = 0;
      catLucky.collected_shard = 0;
      catLucky.collected_ton = 0;
      catLucky.collected_star = 0;
      catLucky.collected_bnb = 0;
      catLucky.collected_plays = 0;
      catLucky.collected_ticket = 0;
      await this.catLuckyRepository.save(catLucky);
    }
    else {
      forceUpdate = true;
    }
    var finalCatLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    return { "force_update": forceUpdate, "status": classToPlain(finalCatLucky) };
  }

}