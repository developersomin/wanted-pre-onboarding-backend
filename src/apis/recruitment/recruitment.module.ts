import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruitment } from './entity/recruitment.entity';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentResolver } from './recruitment.resolver';
import { Company } from '../company/entity/company.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recruitment, Company, User])],
  providers: [RecruitmentResolver, RecruitmentService],
})
export class RecruitmentModule {}
