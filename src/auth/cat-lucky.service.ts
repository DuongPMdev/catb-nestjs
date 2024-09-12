import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CatLucky } from './entity/cat-lucky.entity';

@Injectable()
export class CatLuckyService {
  constructor(
    @InjectRepository(CatLucky)
    private catLuckyRepository: Repository<CatLucky>,
    private jwtService: JwtService,
  ) {}

  async getCatLuckyByAccountID(account_id: string) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    return catLucky;
  }

}