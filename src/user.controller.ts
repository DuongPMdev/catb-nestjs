import { Controller, Get, Post, Param, Body, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':telegram_id')
  findOne(@Param('telegram_id') telegram_id: string): Promise<User> {
    return this.userService.findOne(telegram_id);
  }
}
