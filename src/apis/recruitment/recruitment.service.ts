import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruitment } from './entity/recruitment.entity';
import { Repository } from 'typeorm';
import {
  IRecruitmentServiceApplyRecruitment,
  IRecruitmentServiceCreate,
  IRecruitmentServiceFindOne,
  IRecruitmentServiceSearch,
  IRecruitmentServiceUpdate,
} from './interface/recruitment-service.interface';
import { DetailRecruitmentOutput } from './dto/detail-recruitment.output';
import { UserService } from '../user/user.service';

@Injectable()
export class RecruitmentService {
  constructor(
    @InjectRepository(Recruitment)
    private readonly recruitmentRepository: Repository<Recruitment>,
    private readonly userService: UserService,
  ) {}
  async create({
    createRecruitmentInput,
  }: IRecruitmentServiceCreate): Promise<Recruitment> {
    const { companyId, ...recruitment } = createRecruitmentInput;
    const result = await this.recruitmentRepository.save({
      ...recruitment,
      company: {
        id: companyId,
      },
    });
    return result;
  }

  async findOne({
    recruitmentId,
  }: IRecruitmentServiceFindOne): Promise<Recruitment> {
    const findRecruitment = await this.recruitmentRepository.findOne({
      where: { id: recruitmentId },
      relations: ['company'],
    });
    if (!findRecruitment) {
      throw new UnprocessableEntityException('해당 공고를 찾을 수 없습니다.');
    }
    return findRecruitment;
  }
  findAll(): Promise<Recruitment[]> {
    return this.recruitmentRepository.find({ relations: ['company'] });
  }

  async update({
    recruitmentId,
    updateRecruitmentInput,
  }: IRecruitmentServiceUpdate): Promise<Recruitment> {
    const recruitment = await this.findOne({ recruitmentId });

    const result = await this.recruitmentRepository.save({
      ...recruitment,
      ...updateRecruitmentInput,
    });

    return result;
  }

  async delete({
    recruitmentId,
  }: IRecruitmentServiceFindOne): Promise<boolean> {
    await this.findOne({ recruitmentId });
    await this.recruitmentRepository.softDelete({ id: recruitmentId });
    return true;
  }

  searchFindAll({ search }: IRecruitmentServiceSearch): Promise<Recruitment[]> {
    return this.recruitmentRepository
      .createQueryBuilder('recruitment')
      .innerJoinAndSelect('recruitment.company', 'company')
      .where('recruitment.position Like :search', { search: `%${search}%` })
      .orWhere('recruitment.contents Like :search', { search: `%${search}%` })
      .orWhere('recruitment.stack Like :search', { search: `%${search}%` })
      .orWhere('company.name Like :search', { search: `%${search}%` })
      .orWhere('company.country Like :search', { search: `%${search}%` })
      .orWhere('company.area Like :search', { search: `%${search}%` })
      .getMany();
  }

  async detailFindOne({
    recruitmentId,
  }: IRecruitmentServiceFindOne): Promise<DetailRecruitmentOutput> {
    const recruitment = await this.findOne({ recruitmentId });
    const companyRecruitment = await this.recruitmentRepository.find({
      select: {
        id: true,
      },
      where: {
        company: recruitment.company,
      },
      relations: ['company'],
    });
    const companyRecruitmentId = companyRecruitment.map((el) => el.id);
    const detailRecruitment = {
      ...recruitment,
      companyRecruitmentId,
    };

    return detailRecruitment;
  }

  async applyRecruitment({
    userId,
    recruitmentId,
  }: IRecruitmentServiceApplyRecruitment): Promise<Recruitment> {
    const user = await this.userService.findOne({ userId });
    await this.userService.checkApply({ user });
    const recruitment = await this.recruitmentRepository.findOne({
      where: {
        id: recruitmentId,
      },
      relations: ['users'],
    });
    const { users } = recruitment;
    const temp = [...users, user];
    const result = await this.recruitmentRepository.save({
      ...recruitment,
      users: temp,
    });
    return result;
  }
}
