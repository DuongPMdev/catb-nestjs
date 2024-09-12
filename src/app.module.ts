import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CatLuckyModule } from './auth/cat_lucky.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './auth/entity/account.entity';
import { Currency } from './auth/entity/currency.entity';
import { CatLucky } from './auth/entity/cat-lucky.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'duongpm13',
      password: 'NGen2024@',
      database: 'plays_hub',
      entities: [ Account, Currency, CatLucky ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Account, Currency]),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    CatLuckyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}