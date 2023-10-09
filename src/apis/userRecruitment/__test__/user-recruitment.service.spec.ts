import { UserRecruitmentService } from '../user-recruitment.service';
import { Repository } from 'typeorm';
import { UserRecruitment } from '../entity/user-recruitment.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/user.service';

const mockUserRecruitmentRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('userRecruitmentService', () => {
  let service: UserRecruitmentService;
  let userService: UserService;
  let userRecruitmentRepository: MockRepository<UserRecruitment>;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRecruitmentService,
        UserService,
        {
          provide: getRepositoryToken(UserRecruitment),
          useValue: mockUserRecruitmentRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRecruitmentRepository(),
        },
      ],
    }).compile();

    service = module.get<UserRecruitmentService>(UserRecruitmentService);
    userRecruitmentRepository = module.get<MockRepository<UserRecruitment>>(
      getRepositoryToken(UserRecruitment),
    );
    userService = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('apply()', () => {
    it('사용자 채용공고 신청 ', async () => {
      const userRecruitmentId = '0';
      const userId = '1';
      const recruitmentId = '2';
      const user: User = {
        id: '1',
        name: '안소민',
        apply: false,
        userRecruitments: [],
      };

      const myData = {
        id: userRecruitmentId,
        user: {
          id: userId,
        },
        recruitment: {
          id: recruitmentId,
        },
      };
      jest.spyOn(userService, 'findOne').mockImplementation(
        (userId) =>
          new Promise((resolve) => {
            resolve(user);
          }),
      );
      jest.spyOn(userService, 'checkApply').mockImplementation(
        (user) =>
          new Promise((resolve) => {
            resolve(true);
          }),
      );

      userRecruitmentRepository.save.mockResolvedValue(myData);
      const result = await service.apply({ userId, recruitmentId });
      expect(userRecruitmentRepository.save).toHaveBeenCalledWith({
        user: {
          id: userId,
        },
        recruitment: {
          id: recruitmentId,
        },
      });
      expect(result).toEqual(myData);
    });
  });
});
