import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  IUserServiceFindOne,
  IUserServiceIsApply,
} from './interface/user-service.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkApply({ user }: IUserServiceIsApply): Promise<Boolean> {
    if (user.apply) {
      throw new UnprocessableEntityException(
        '지원하신 내역이 있습니다. 사용자는 1회만 지원 가능합니다.',
      );
    }
    await this.userRepository.save({
      ...user,
      apply: true,
    });

    return true;
  }

  async findOne({ userId }: IUserServiceFindOne): Promise<User> {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!findUser) {
      throw new UnprocessableEntityException('해당 유저를 찾을 수 없습니다.');
    }
    return findUser;
  }
}
