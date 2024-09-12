import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  // Protect the route using JWT AuthGuard
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get Profile' })
  @ApiResponse({ status: 200, description: 'Successful retrieval of user profile', schema: { example: { userId: 1, username: 'testuser' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    // Return the user's profile based on the JWT token's payload
    return req.user;
  }
}