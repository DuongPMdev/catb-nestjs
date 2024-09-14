import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaysHubConfigQuest } from './entity/plays-hub-config-quest.entity';
import { PlaysHubProgressQuest } from './entity/plays-hub-progress-quest.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class PlaysHubService {
  constructor(
    @InjectRepository(PlaysHubConfigQuest)
    private playsHubConfigQuestRepository: Repository<PlaysHubConfigQuest>,
    @InjectRepository(PlaysHubProgressQuest)
    private playsHubProgressQuestRepository: Repository<PlaysHubProgressQuest>,
  ) {}

  async getPlaysHubQuestStatus(account_id: string) {
    const playsHubConfigQuest = await this.playsHubConfigQuestRepository.findAll();
    const playsHubProgressQuest = await this.playsHubProgressQuestRepository.findOne({ where: { account_id: account_id } });
    return { "config_quest": classToPlain(playsHubConfigQuest), "progress_quest": classToPlain(playsHubProgressQuest) };
  }

}