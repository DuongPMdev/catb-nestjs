import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TestDto } from './dto/test.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Successful login', schema: { example: { access_token: 'your-jwt-token-here' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() testDto: TestDto) {
    const user = await this.authService.validateUser(testDto.username, testDto.password);
    if (user) {
      return this.authService.login(user);
    }
    return { message: 'Invalid credentials' };
  }
}