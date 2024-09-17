import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './auth/entity/account.entity';
import { Currency } from './auth/entity/currency.entity';
import { GameCatLuckyStatistic } from './auth/entity/game-cat-lucky-statistic.entity';
import { GameCatBattleStatistic } from './auth/entity/game-cat-battle-statistic.entity';
import { PlaysHubConfigQuest } from './auth/entity/plays-hub-config-quest.entity';
import { PlaysHubProgressQuest } from './auth/entity/plays-hub-progress-quest.entity';
import { GameCatLuckyModule } from './auth/game-cat-lucky.module';
import { GameCatBattleModule } from './auth/game-cat-battle.module';
import { PlaysHubModule } from './auth/plays-hub.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'duongpm13',
      password: 'NGen2024@',
      database: 'plays_hub',
      entities: [ Account, Currency, GameCatLuckyStatistic, GameCatBattleStatistic, PlaysHubConfigQuest, PlaysHubProgressQuest ],
      synchronize: false, // never change it to true : true will force clear db
    }),
    TypeOrmModule.forFeature([Account, Currency, GameCatLuckyStatistic, GameCatBattleStatistic, PlaysHubConfigQuest, PlaysHubProgressQuest]),
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