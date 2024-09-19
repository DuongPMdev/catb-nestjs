import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
import { PlaysHubService } from './plays-hub.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlaysHubQuestDTO } from './dto/plays-hub-quest.dto';


@Injectable()
@ApiTags('plays-hub')
@Controller('plays-hub')
export class PlaysHubController {
  constructor(private readonly playsHubService: PlaysHubService) {}
  
  @Get('invite_reward_config')
  @ApiOperation({ summary: 'Get Plays Hub quests status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Plays Hub quests'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async invite_reward_config(@Request() req) {
    const inviteRewardConfig = await this.playsHubService.getInviteRewardConfig();
    return inviteRewardConfig;
  }
  
  @Get('plays_leaderboard')
  @ApiOperation({ summary: 'Get Plays Hub quests status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Plays Hub quests'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async plays_leaderboard(@Request() req) {
    const playsLeaderboard = await this.playsHubService.getPlaysLeaderboard();
    return playsLeaderboard;
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('plays_leaderboard_position')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Plays Hub quests status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Plays Hub quests'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async plays_leaderboard_position(@Request() req) {
    const account_id = req.user.account_id;
    const playsLeaderboardPosition = await this.playsHubService.getPlaysLeaderboardPosition(account_id);
    return { "plays_rank": playsLeaderboardPosition };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('quest_status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Plays Hub quests status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Plays Hub quests'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async status(@Request() req) {
    const account_id = req.user.account_id;
    const playsHubQuestStatus = await this.playsHubService.getPlaysHubQuestStatus(account_id);
    return playsHubQuestStatus;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('proceed_quest')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check and collect quest if able' })
  @ApiResponse({ status: 200, description: 'Successful Check and collect quest if able'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async proceed_quest(@Request() req, @Body() playHubQuestDTO: PlaysHubQuestDTO) {
    const account_id = req.user.account_id;
    const playsHubQuestStatus = await this.playsHubService.proceedPlaysHubQuest(account_id, playHubQuestDTO.type, playHubQuestDTO.request_type);
    return playsHubQuestStatus;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('check_quest')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check and collect quest if able' })
  @ApiResponse({ status: 200, description: 'Successful Check and collect quest if able'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async check_quest(@Request() req, @Body() playHubQuestDTO: PlaysHubQuestDTO) {
    const account_id = req.user.account_id;
    const playsHubQuestStatus = await this.playsHubService.checkPlaysHubQuest(account_id, playHubQuestDTO.type, playHubQuestDTO.request_type);
    return playsHubQuestStatus;
  }

}