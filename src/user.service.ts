import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneByTelegramId(telegramId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ telegram_id: telegramId });
    if (!user) {
      throw new NotFoundException(`User with Telegram ID ${telegramId} not found`);
    }
    return user;
  }
}
