import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GameCatBattleStatistic } from './entity/game-cat-battle-statistic.entity';
import { GameCatBattleService } from './game-cat-battle.service';
import { GameCatBattleController } from './game-cat-battle.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ GameCatBattleStatistic ]),
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
  providers: [GameCatBattleService],
  controllers: [GameCatBattleController],
  exports: [GameCatBattleService],
})

export class GameCatBattleModule {}