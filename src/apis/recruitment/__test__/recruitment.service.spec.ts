import { Repository } from 'typeorm';
import { RecruitmentService } from '../recruitment.service';
import { Recruitment } from '../entity/recruitment.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRecruitmentInput } from '../dto/create-recruitment.input';
import { UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { User } from '../../user/entity/user.entity';

const mockRecruitmentRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('recruitmentService', () => {
  let service: RecruitmentService;
  let userService: UserService;
  let recruitmentRepository: MockRepository<Recruitment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruitmentService,
        UserService,
        {
          provide: getRepositoryToken(Recruitment),
          useValue: mockRecruitmentRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockRecruitmentRepository(),
        },
      ],
    }).compile();

    service = module.get<RecruitmentService>(RecruitmentService);
    userService = module.get<UserService>(UserService);
    recruitmentRepository = module.get<MockRepository<Recruitment>>(
      getRepositoryToken(Recruitment),
    );
  });

  describe('create()', () => {
    const createRecruitmentInput: CreateRecruitmentInput = {
      position: '백엔드',
      reward: 10000,
      stack: '노드',
      contents: '백엔드 주니어 신입 개발자',
      companyId: '애플_1234',
    };

    it('채용 공고 등록 성공', async () => {
      recruitmentRepository.save.mockResolvedValue({
        createRecruitmentInput,
      });
      const result = await service.create({ createRecruitmentInput });
      const { companyId, ...res } = createRecruitmentInput;

      expect(recruitmentRepository.save).toHaveBeenCalledTimes(1);
      expect(recruitmentRepository.save).toHaveBeenCalledWith({
        ...res,
        company: { id: companyId },
      });
    });
  });

  describe('findAll()', () => {
    it('채용공고 목록 성공 ', async () => {
      recruitmentRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(recruitmentRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('findOne()', () => {
    const recruitmentId = '1';
    const mockedRecruitment = {
      id: '1',
      position: '백엔드',
      reward: 10000,
      stack: '노드',
      contents: '백엔드 주니어 신입 개발자',
      company: {
        Id: '애플_1234',
      },
    };

    it('채용공고 id로 찾기 성공 ', async () => {
      recruitmentRepository.findOne.mockResolvedValue(mockedRecruitment);

      const result = await service.findOne({ recruitmentId });

      expect(recruitmentRepository.findOne).toHaveBeenCalledTimes(1);
      expect(recruitmentRepository.findOne).toHaveBeenCalledWith({
        relations: ['company'],
        where: {
          id: '1',
        },
      });
      expect(result).toEqual(mockedRecruitment);
    });
    it('채용공고 id로 찾기 실패 ', async () => {
      recruitmentRepository.findOne.mockResolvedValue(null);
      try {
        await service.findOne({ recruitmentId });
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
        expect(e.message).toBe('해당 공고를 찾을 수 없습니다.');
      }
    });
  });

  describe('update()', () => {
    const recruitmentId = '1';
    const updateRecruitmentInput = {
      contents: '테스트코드 어려워요....',
    };
    const oldRecruitment = {
      id: '1',
      position: '백엔드',
      reward: 10000,
      stack: '노드',
      contents: '백엔드 주니어 신입 개발자',
      company: {
        Id: '애플_1234',
      },
    };
    const newRecruitment = {
      id: '1',
      position: '백엔드',
      reward: 10000,
      stack: '노드',
      contents: '테스트코드 어려워요....',
      company: {
        Id: '애플_1234',
      },
    };

    it('채용공고 업데이트 성공 ', async () => {
      recruitmentRepository.findOne.mockResolvedValue(oldRecruitment);
      recruitmentRepository.save.mockResolvedValue(newRecruitment);

      const result = await service.update({
        recruitmentId,
        updateRecruitmentInput,
      });

      expect(recruitmentRepository.findOne).toHaveBeenCalledTimes(1);
      expect(recruitmentRepository.findOne).toHaveBeenCalledWith({
        relations: ['company'],
        where: {
          id: '1',
        },
      });
      expect(recruitmentRepository.save).toHaveBeenCalledTimes(1);
      expect(recruitmentRepository.save).toHaveBeenCalledWith({
        ...oldRecruitment,
        ...updateRecruitmentInput,
      });
      expect(result).toEqual(newRecruitment);
    });

    it(' 채용공고 업데이트 실패 ', async () => {
      recruitmentRepository.findOne.mockResolvedValue(null);
      recruitmentRepository.save.mockResolvedValue(newRecruitment);
      try {
        await service.findOne({ recruitmentId });
        const result = await service.update({
          recruitmentId,
          updateRecruitmentInput,
        });
        expect(recruitmentRepository.save).toHaveBeenCalledWith({
          ...oldRecruitment,
          ...updateRecruitmentInput,
        });
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
        expect(e.message).toBe('해당 공고를 찾을 수 없습니다.');
      }
    });
  });

  describe('delete()', () => {
    const recruitmentId = '1';
    const findOneArgs = { id: '1' };
    const softDeleteArgs = { id: '1' };

    it('삭제 성공 ', async () => {
      recruitmentRepository.findOne.mockResolvedValue(findOneArgs);
      recruitmentRepository.softDelete.mockResolvedValue(softDeleteArgs);

      const result = await service.delete({ recruitmentId });

      expect(recruitmentRepository.findOne).toHaveBeenCalledTimes(1);

      expect(recruitmentRepository.softDelete).toHaveBeenCalledTimes(1);
      expect(recruitmentRepository.softDelete).toHaveBeenCalledWith(
        softDeleteArgs,
      );
      expect(result).toEqual(true);
    });

    it('삭제 실패 삭제할 id가 없을 때 ', async () => {
      try {
        await service.delete({ recruitmentId });
      } catch (e) {
        expect(e).toBeInstanceOf(UnprocessableEntityException);
        expect(e.message).toBe('해당 공고를 찾을 수 없습니다.');
      }
    });
  });

  describe('applyRecruitment()', () => {
    const userId = '1';
    const recruitmentId = '1';

    const user = {
      id: '1',
      name: '안소민',
      apply: true,
      recruitments: [],
    };
    const recruitment = {
      id: '1',
      position: '백엔드',
      reward: 10000,
      stack: '노드',
      contents: '백엔드 주니어 신입 개발자',
      company: {
        Id: '애플_1234',
      },
      users: [],
    };
    const applyRecruitment = {
      id: '1',
      position: '백엔드',
      reward: 10000,
      stack: '노드',
      contents: '백엔드 주니어 신입 개발자',
      company: {
        Id: '애플_1234',
      },
      users: [user],
    };

    it(' 채용공고 신청 성공', async () => {
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
      recruitmentRepository.findOne.mockResolvedValue(recruitment);
      const users = recruitment.users;
      recruitmentRepository.save.mockResolvedValue(applyRecruitment);
      const result = await service.applyRecruitment({ userId, recruitmentId });
      expect(result).toEqual(applyRecruitment);
    });
  });
});
