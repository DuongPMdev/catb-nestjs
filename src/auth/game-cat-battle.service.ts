import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class GameCatBattleService {
  constructor(
    @InjectRepository(GameCatBattleStatistic)
    private gameCatBattleStatisticRepository: Repository<GameCatBattleStatistic>,
  ) {}

  async getGameCatBattleStatistic(account_id: string) {
    let finalGameCatBattleStatistic = await this.gameCatBattleStatisticRepository.findOne({ where: { account_id: account_id } });
    if (finalGameCatBattleStatistic == null) {
      finalGameCatBattleStatistic = new GameCatBattleStatistic(account_id);
    }
    return { "statistic": classToPlain(finalGameCatBattleStatistic) };
  }

}