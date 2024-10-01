import { Controller, Post, Get, Body, Request, Query, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
import { GameCatBattleService } from './game-cat-battle.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Injectable()
@ApiTags('game-cat-battle')
@Controller('game-cat-battle')
export class GameCatBattleController {
  constructor(private readonly gameCatBattleService: GameCatBattleService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('statistic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Battle Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Battle Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async statistic(@Request() req) {
    const account_id = req.user.account_id;
    const gameCatBattleStatistic = await this.gameCatBattleService.getGameCatBattleStatistic(account_id);
    return gameCatBattleStatistic;
  }
  
  @Get('ads_impression')
  @ApiOperation({ summary: '' })
  @ApiResponse({ status: 200, description: ''})
  async ads_impression(@Request() req, @Query() query: any) {
    const { userid, key } = query;
    console.log('ads_impression : ' + userid + ', ' + key);
    return { 'successed': true };
  }

}