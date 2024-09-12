import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './auth/entity/account.entity';
import { Statistic } from './auth/entity/statistic.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'duongpm13',
      password: 'NGen2024@',
      database: 'cat_battle',
      entities: [ Account, Statistic ],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Account, Statistic]),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
