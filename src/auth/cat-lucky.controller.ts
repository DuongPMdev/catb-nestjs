import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
import { CatLuckyService } from './cat-lucky.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatLuckyDTO } from './dto/cat-lucky.dto';


@Injectable()
@ApiTags('cat-lucky')
@Controller('cat-lucky')
export class CatLuckyController {
  constructor(private readonly catLuckyService: CatLuckyService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Cat Lucky Game status' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of Cat Lucky Game status'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async status(@Request() req) {
    const account_id = req.user.account_id;
    const catLucky = await this.catLuckyService.getCatLuckyStatus(account_id);
    return catLucky;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('play')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Play Cat Lucky Game' })
  @ApiResponse({ status: 200, description: 'Played Cat Lucky Game'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async play(@Request() req, @Body() catLuckyDTO: CatLuckyDTO) {
    const account_id = req.user.account_id;
    const catLucky = await this.catLuckyService.playCatLucky(account_id, catLuckyDTO.stage);
    return catLucky;
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('finish')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Finish Cat Lucky Game' })
  @ApiResponse({ status: 200, description: 'Finished Cat Lucky Game'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async finish(@Request() req, @Body() catLuckyDTO: CatLuckyDTO) {
    const account_id = req.user.account_id;
    const catLucky = await this.catLuckyService.finishCatLucky(account_id, catLuckyDTO.stage);
    return catLucky;
  }
}