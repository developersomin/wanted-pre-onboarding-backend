import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRecruitment } from './entity/user-recruitment.entity';
import { UserRecruitmentResolver } from './user-recruitment.resolver';
import { UserRecruitmentService } from './user-recruitment.service';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRecruitment, User])],
  providers: [UserRecruitmentResolver, UserRecruitmentService, UserService],
})
export class UserRecruitmentModule {}
