import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
import { CatLuckyService } from './cat-lucky.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';


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
  async getProfile(@Request() req) {
    const account_id = req.user.account_id;
    var catLucky = await this.catLuckyService.getCatLuckyByAccountID(account_id);
    if (catLucky == null) {
        catLucky = new catLucky(account_id);
    }
    return classToPlain(catLucky);
  }
}