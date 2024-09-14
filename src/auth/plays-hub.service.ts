import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaysHubConfigQuest } from './entity/plays-hub-config-quest.entity';
import { PlaysHubProgressQuest } from './entity/plays-hub-progress-quest.entity';
import { Currency } from './entity/currency.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class PlaysHubService {
  constructor(
    @InjectRepository(PlaysHubConfigQuest)
    private playsHubConfigQuestRepository: Repository<PlaysHubConfigQuest>,
    @InjectRepository(PlaysHubProgressQuest)
    private playsHubProgressQuestRepository: Repository<PlaysHubProgressQuest>,
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async getPlaysHubQuestStatus(account_id: string) {
    const playsHubConfigQuest = await this.playsHubConfigQuestRepository.find();
    const playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id } });
    return { "config_quest": classToPlain(playsHubConfigQuest), "progress_quest": classToPlain(playsHubProgressQuest) };
  }

  async collectPlaysHubQuest(account_id: string, type: string, request_type: string) {
    let playHubDataQuest = {
      "type": type,
      "request_type": request_type,
    };
    const playsHubConfigQuest = await this.playsHubConfigQuestRepository.findOne({ where: { type: type, request_type:request_type } });
    if (playsHubConfigQuest) {
      playHubDataQuest["icon_name"] = playsHubConfigQuest.icon_name;
      playHubDataQuest["description"] = playsHubConfigQuest.description;
      playHubDataQuest["request_amount"] = playsHubConfigQuest.request_amount;
      playHubDataQuest["reward"] = playsHubConfigQuest.reward;
      playHubDataQuest["additional"] = playsHubConfigQuest.additional;
      if (type == "DAILY") {
        const playsHubProgressQuest = await this.playsHubConfigQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type:request_type } });
        playHubDataQuest["progress_amount"] = playsHubProgressQuest.progress_amount;
        playHubDataQuest["rewarded_step"] = playsHubProgressQuest.rewarded_step;
        playHubDataQuest["daily_date"] = playsHubProgressQuest.daily_date;
      }
      else {
        let playsHubProgressQuest = await this.playsHubConfigQuestRepository.findOne({ where: { account_id: account_id, type: type, request_type:request_type } });
        if (playsHubProgressQuest == null) {
          playsHubProgressQuest = new PlaysHubProgressQuest(account_id);
        }
        playHubDataQuest["progress_amount"] = playsHubProgressQuest.progress_amount;
        playHubDataQuest["rewarded_step"] = playsHubProgressQuest.rewarded_step;
        playHubDataQuest["daily_date"] = playsHubProgressQuest.daily_date;
      }
      let currency = await this.currencyRepository.findOne({ where: { account_id: account_id } });
      if (currency == null) {
        currency = new Currency(account_id);
      }
      return playHubDataQuest;
    }
    return null;
  }

}