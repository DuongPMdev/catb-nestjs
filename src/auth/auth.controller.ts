import { Controller, Post, Get, Body, Request, UseGuards, Injectable, NotFoundException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { classToPlain } from 'class-transformer';


@Injectable()
@ApiTags('account')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful login', schema: { example: { access_token: 'your-jwt-token-here' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const account = await this.authService.validateAccountByTelegramID(loginDto.telegram_id);
    if (account) {
      if (loginDto.referral_id) {

      }
      return this.authService.login(account);
    }
    return { message: 'Invalid credentials' };
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth() // Swagger will expect the JWT token in the header
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of account profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const profile = await this.authService.getAccountByTelegramID(telegram_id);
    if (profile) {
      const statistic = await this.authService.getStatisticByAccountID(profile.account_id);
      return { "profile": classToPlain(profile), "statistic": statistic };
    }
    else {
      throw new NotFoundException('Profile not found');
    }
  }
}