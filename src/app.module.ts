import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './auth/entity/account.entity';
import { Currency } from './auth/entity/currency.entity';
import { Friend } from './auth/entity/friend.entity';
import { Transaction } from './auth/entity/transaction.entity';
import { TelegramAdsConfig } from './auth/entity/telegram_ads_config.entity';
import { GameCatLuckyStatistic } from './auth/entity/game-cat-lucky-statistic.entity';
import { GameCatLuckyTimeLocker } from './auth/entity/game-cat-lucky-time_locker.entity';
import { GameCatLuckyConfigShop } from './auth/entity/game-cat-lucky-config-shop.entity';
import { GameCatLuckyConfigLeaderboardReward } from './auth/entity/game-cat-lucky-config-leaderboard-reward.entity';
import { GameCatBattleStatistic } from './auth/entity/game-cat-battle-statistic.entity';
import { PlaysHubConfigQuest } from './auth/entity/plays-hub-config-quest.entity';
import { PlaysHubProgressQuest } from './auth/entity/plays-hub-progress-quest.entity';
import { GameCatLuckyModule } from './auth/game-cat-lucky.module';
import { GameCatBattleModule } from './auth/game-cat-battle.module';
import { PlaysHubModule } from './auth/plays-hub.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'duongpm13dev',
      password: 'NGen2024@',
      database: 'plays_hub',
      entities: [ Account, Currency, Friend, Transaction, TelegramAdsConfig, GameCatLuckyStatistic, GameCatLuckyTimeLocker, GameCatLuckyConfigShop, GameCatLuckyConfigLeaderboardReward, GameCatBattleStatistic, PlaysHubConfigQuest, PlaysHubProgressQuest ],
      synchronize: false, // never change it to true : true will force clear db
    }),
    TypeOrmModule.forFeature([Account, Currency, Friend, Transaction, TelegramAdsConfig, GameCatLuckyStatistic, GameCatLuckyTimeLocker, GameCatLuckyConfigShop, GameCatLuckyConfigLeaderboardReward, GameCatBattleStatistic, PlaysHubConfigQuest, PlaysHubProgressQuest]),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PlaysHubModule,
    GameCatLuckyModule,
    GameCatBattleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}