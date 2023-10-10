import { Repository } from 'typeorm';
import { UserService } from '../user.service';
import { User } from '../entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnprocessableEntityException } from '@nestjs/common';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('userService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;
  const userId = '1';
  const user = {
    id: '1',
    name: '안소민',
    apply: false,
    recruitments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('checkApply()', () => {
    const newUser = {
      id: '1',
      name: '안소민',
      apply: true,
      recruitments: [],
    };

    it('User 채용공고 신청시 apply를 true로 바꾸기', async () => {
      userRepository.findOne.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(newUser);

      const result = await service.checkApply({ user });

      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        apply: true,
      });
      expect(result).toEqual(true);
    });
  });

  describe('findOne()', () => {
    it('사용자 id로 찾기 성공 ', async () => {
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne({ userId });

      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
      expect(result).toEqual(user);
    });
    it('사용 id로 찾기 실패 ', async () => {
      userRepository.findOne.mockResolvedValue(null);
      try {
        await service.findOne({ userId });
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
        expect(e.message).toBe('해당 유저를 찾을 수 없습니다.');
      }
    });
  });
});
