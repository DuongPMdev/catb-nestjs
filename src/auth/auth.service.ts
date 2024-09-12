import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(telegram_id: string): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { telegram_id } });
    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { telegram_id: user.telegram_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getProfile(telegram_id: string) {
    return await this.usersRepository.findOne({ where: { telegram_id: telegram_id } });
  }
}