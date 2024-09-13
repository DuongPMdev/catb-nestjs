import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CatLucky } from './entity/cat-lucky.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class CatLuckyService {
  constructor(
    @InjectRepository(CatLucky)
    private catLuckyRepository: Repository<CatLucky>,
    private jwtService: JwtService,
  ) {}

  async getCatLuckyStatus(account_id: string) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    return { "status": classToPlain(catLucky) };
  }

  async playCatLucky(account_id: string, stage: number) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    if (stage == catLucky.stage) {
      return { "force_update": false, "status": classToPlain(catLucky) };
    }
    else {
      return { "force_update": true, "status": classToPlain(catLucky) };
    }
  }

  async finishCatLucky(account_id: string) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    return catLucky;
  }

}