import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDTO } from './dto/login.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';


@Injectable()
@ApiTags('account')
@Controller('account')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful login', schema: { example: { access_token: 'your-jwt-token-here' }}})
  async login(@Body() loginDTO: LoginDTO) {
    const account = await this.authService.validateAccount(loginDTO);
    if (loginDTO.telegram_id == "") {
      throw new BadRequestException('Invalid credentials');
    }
    if (account) {
      return this.authService.login(account);
    }
    return { message: 'Invalid credentials' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async profile(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const currency = await this.authService.getCurrencyByAccountID(account.account_id);
      const gameCatLuckyStatistic = await this.authService.getGameCatLuckyStatisticByAccountID(account.account_id);
      const gameCatBattleStatistic = await this.authService.getGameCatBattleStatisticByAccountID(account.account_id);
      return {
        "account": classToPlain(account),
        "currency": classToPlain(currency),
        "game_cat_lucky_statistic": classToPlain(gameCatLuckyStatistic),
        "game_cat_battle_statistic": classToPlain(gameCatBattleStatistic)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('account')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async account(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      return {
        "account": classToPlain(account)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('currency')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async currency(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const currency = await this.authService.getCurrencyByAccountID(account.account_id);
      return {
        "currency": classToPlain(currency)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('game_cat_lucky_statistic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async game_cat_lucky_statistic(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const gameCatLuckyStatistic = await this.authService.getGameCatLuckyStatisticByAccountID(account.account_id);
      return {
        "game_cat_lucky_statistic": classToPlain(gameCatLuckyStatistic)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('game_cat_battle_statistic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async game_cat_battle_statistic(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const account = await this.authService.getAccountByTelegramID(telegram_id);
    if (account) {
      const gameCatBattleStatistic = await this.authService.getGameCatBattleStatisticByAccountID(account.account_id);
      return {
        "game_cat_battle_statistic": classToPlain(gameCatBattleStatistic)
      };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }

}