import { Controller, Post, Get, Body, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful login', schema: { example: { access_token: 'your-jwt-token-here' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.telegram_id);
    if (user) {
      if (loginDto.referral_id) {

      }
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of user profile'})
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    const telegram_id = req.user.telegram_id;
    const profile = await this.authService.getProfile(telegram_id);
    return profile;
  }
}