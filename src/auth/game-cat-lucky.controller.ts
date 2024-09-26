import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
import { GameCatLuckyService } from './game-cat-lucky.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GameCatLuckyDTO } from './dto/game-cat-lucky.dto';


@Injectable()
@ApiTags('game-cat-lucky')
@Controller('game-cat-lucky')
export class GameCatLuckyController {
  constructor(private readonly gameCatLuckyService: GameCatLuckyService) {}

  @UseGuards(JwtAuthGuard)
  @Get('played_point_leaderboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async played_point_leaderboard(@Request() req) {
    const playedPointLeaderboard = await this.gameCatLuckyService.getPlayedPointLeaderboard();
    return playedPointLeaderboard;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('played_point_leaderboard_position')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Plays Hub quests status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Plays Hub quests'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async plays_leaderboard_position(@Request() req) {
    const account_id = req.user.account_id;
    const playsLeaderboardPosition = await this.gameCatLuckyService.getPlayedPointLeaderboardPosition(account_id);
    return playsLeaderboardPosition;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('config_shop')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async config_shop(@Request() req) {
    const gameCatLuckyConfigShops = await this.gameCatLuckyService.getGameCatLuckyConfigShops();
    return gameCatLuckyConfigShops;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('config_leaderboard_reward')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async config_leaderboard_reward(@Request() req) {
    const gameCatLuckyConfigLeaderboardRewards = await this.gameCatLuckyService.getGameCatLuckyConfigLeaderboardRewards();
    return gameCatLuckyConfigLeaderboardRewards;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('ticket')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async ticket(@Request() req) {
    const account_id = req.user.account_id;
    const gameCatLuckyTicket = await this.gameCatLuckyService.getGameCatLuckyTicket(account_id);
    return gameCatLuckyTicket;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('free_ticket')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async free_ticket(@Request() req) {
    const gameCatLuckySecondToFreeTicket = await this.gameCatLuckyService.getGameCatLuckySecondToFreeTicket();
    return gameCatLuckySecondToFreeTicket;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('statistic')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game statistic' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game statistic'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async statistic(@Request() req) {
    const account_id = req.user.account_id;
    const gameCatLuckyStatistic = await this.gameCatLuckyService.getGameCatLuckyStatistic(account_id);
    return gameCatLuckyStatistic;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('play')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Play Cat Lucky Game' })
  @ApiResponse({ status: 200, description: 'Played Cat Lucky Game'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async play(@Request() req, @Body() gameCatLuckyDTO: GameCatLuckyDTO) {
    const account_id = req.user.account_id;
    const gameCatLuckyStatus = await this.gameCatLuckyService.playGameCatLucky(account_id, gameCatLuckyDTO.stage);
    return gameCatLuckyStatus;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('finish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finish Cat Lucky Game' })
  @ApiResponse({ status: 200, description: 'Finished Cat Lucky Game'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async finish(@Request() req, @Body() gameCatLuckyDTO: GameCatLuckyDTO) {
    const account_id = req.user.account_id;
    const gameCatLuckyStatus = await this.gameCatLuckyService.finishGameCatLucky(account_id, gameCatLuckyDTO.stage);
    return gameCatLuckyStatus;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('play_on')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Play On Cat Lucky Game' })
  @ApiResponse({ status: 200, description: 'Finished Cat Lucky Game'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async play_on(@Request() req, @Body() gameCatLuckyDTO: GameCatLuckyDTO) {
    const account_id = req.user.account_id;
    const gameCatLuckyStatus = await this.gameCatLuckyService.playOnGameCatLucky(account_id, gameCatLuckyDTO.stage);
    return gameCatLuckyStatus;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('give_up')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Play On Cat Lucky Game' })
  @ApiResponse({ status: 200, description: 'Finished Cat Lucky Game'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async give_up(@Request() req, @Body() gameCatLuckyDTO: GameCatLuckyDTO) {
    const account_id = req.user.account_id;
    const gameCatLuckyStatus = await this.gameCatLuckyService.giveUpGameCatLucky(account_id, gameCatLuckyDTO.stage);
    return gameCatLuckyStatus;
  }

}