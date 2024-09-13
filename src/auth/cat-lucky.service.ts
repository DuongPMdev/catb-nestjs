import { Injectable } from '@nestjs/common';
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
      catLucky.stage++;
      catLucky.collected_gem += 100;
      catLucky.current_stage_result = "GEM:100,GEM:100,GEM:100,GAMEOVER:1";
      const savedCatLucky = this.catLuckyRepository.save(catLucky);
      return { "force_update": false, "status": classToPlain(savedCatLucky) };
    }
    else {
      return { "force_update": true, "status": classToPlain(catLucky) };
    }
  }

  async finishCatLucky(account_id: string, stage: number) {
    var catLucky = await this.catLuckyRepository.findOne({ where: { account_id: account_id } });
    if (catLucky == null) {
        catLucky = new CatLucky(account_id);
    }
    if (stage == catLucky.stage) {
      catLucky.stage = 0;
      catLucky.collected_gem = 0;
      catLucky.current_stage_result = "";
      const savedCatLucky = this.catLuckyRepository.save(catLucky);
      return { "force_update": false, "status": classToPlain(savedCatLucky) };
    }
    else {
      return { "force_update": true, "status": classToPlain(catLucky) };
    }
  }

}