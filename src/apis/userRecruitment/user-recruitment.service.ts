import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRecruitment } from './entity/user-recruitment.entity';
import { UserService } from '../user/user.service';
import { IUserRecruitmentApply } from './interface/userRecruitment-servuce.interface';

@Injectable()
export class UserRecruitmentService {
  constructor(
    @InjectRepository(UserRecruitment)
    private readonly userRecruitmentRepository: Repository<UserRecruitment>,
    private readonly userService: UserService,
  ) {}

  findAll(): Promise<UserRecruitment[]> {
    return this.userRecruitmentRepository.find();
  }

  async apply({
    userId,
    recruitmentId,
  }: IUserRecruitmentApply): Promise<UserRecruitment> {
    const findUser = await this.userService.findOne({ userId });

    this.userService.checkApply({ user: findUser });
    const result = await this.userRecruitmentRepository.save({
      user: {
        id: userId,
      },
      recruitment: {
        id: recruitmentId,
      },
    });

    return result;
  }
}
