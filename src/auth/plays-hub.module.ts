import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Account } from './entity/account.entity';
import { Currency } from './entity/currency.entity';
import { Friend } from './entity/friend.entity';
import { Transaction } from './entity/transaction.entity';
import { PlaysHubConfigQuest } from './entity/plays-hub-config-quest.entity';
import { PlaysHubProgressQuest } from './entity/plays-hub-progress-quest.entity';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { GameCatLuckyStatistic } from './entity/game-cat-lucky-statistic.entity';
import { PlaysHubService } from './plays-hub.service';
import { PlaysHubController } from './plays-hub.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Account, Currency, Friend, Transaction, PlaysHubConfigQuest, PlaysHubProgressQuest, GameCatBattleStatistic, GameCatLuckyStatistic ]),
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
  providers: [PlaysHubService],
  controllers: [PlaysHubController],
  exports: [PlaysHubService],
})

export class PlaysHubModule {}