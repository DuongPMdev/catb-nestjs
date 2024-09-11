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

  async findOneByTelegramId(telegram_id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ telegram_id: telegram_id });
    if (!user) {
      throw new NotFoundException(`User with Telegram ID ${telegram_id} not found`);
    }
    return user;
  }
}
