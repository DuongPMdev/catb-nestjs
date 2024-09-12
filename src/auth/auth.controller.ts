import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
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
  async getProfile(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const profile = await this.authService.getAccountByTelegramID(telegram_id);
    if (profile) {
      const currency = await this.authService.getCurrencyByAccountID(profile.account_id);
      return { "profile": classToPlain(profile), "currency": classToPlain(currency) };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
}