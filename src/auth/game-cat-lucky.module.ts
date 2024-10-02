import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { TelegramAdsConfig } from './entity/telegram_ads_config.entity';
import { GameCatLuckyStatistic } from './entity/game-cat-lucky-statistic.entity';
import { GameCatLuckyTimeLocker } from './entity/game-cat-lucky-time_locker.entity';
import { GameCatLuckyConfigShop } from './entity/game-cat-lucky-config-shop.entity';
import { GameCatLuckyConfigLeaderboardReward } from './entity/game-cat-lucky-config-leaderboard-reward.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { GameCatLuckyService } from './game-cat-lucky.service';
import { GameCatLuckyController } from './game-cat-lucky.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([ Account, Currency, TelegramAdsConfig, GameCatLuckyStatistic, GameCatLuckyConfigShop, GameCatLuckyConfigLeaderboardReward, GameCatBattleStatistic, GameCatLuckyTimeLocker ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [GameCatLuckyService],
  controllers: [GameCatLuckyController],
  exports: [GameCatLuckyService],
})

export class GameCatLuckyModule {}