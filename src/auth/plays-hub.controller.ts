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
  @Post('collect_quest')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Plays Hub quests status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Plays Hub quests'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async collect_quest(@Request() req, @Body() playHubQuestDTO: PlaysHubQuestDTO) {
    const account_id = req.user.account_id;
    const playsHubQuestStatus = await this.playsHubService.collectPlaysHubQuest(account_id, playHubQuestDTO.type, playHubQuestDTO.request_type);
    return playsHubQuestStatus;
  }

}