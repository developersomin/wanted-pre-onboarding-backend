import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Recruitment } from './entity/recruitment.entity';
import { CreateRecruitmentInput } from './dto/create-recruitment.input';
import { RecruitmentService } from './recruitment.service';
import { UpdateRecruitmentInput } from './dto/update-recruitment.input';
import { DetailRecruitmentOutput } from './dto/detail-recruitment.output';

@Resolver()
export class RecruitmentResolver {
  constructor(private readonly recruitmentService: RecruitmentService) {}

  @Query(() => Recruitment)
  fetchRecruitment(
    @Args('recruitmentId') recruitmentId: string,
  ): Promise<Recruitment> {
    return this.recruitmentService.findOne({ recruitmentId });
  }

  @Query(() => [Recruitment])
  fetchRecruitments(): Promise<Recruitment[]> {
    return this.recruitmentService.findAll();
  }

  @Query(() => DetailRecruitmentOutput)
  detailFetchRecruitment(
    @Args('recruitmentId') recruitmentId: string,
  ): Promise<DetailRecruitmentOutput> {
    return this.recruitmentService.detailFindOne({ recruitmentId });
  }

  @Query(() => [Recruitment])
  searchFindAll(@Args('search') search: string): Promise<Recruitment[]> {
    return this.recruitmentService.searchFindAll({ search });
  }

  @Mutation(() => Recruitment)
  createRecruitment(
    @Args('createRecruitmentInput')
    createRecruitmentInput: CreateRecruitmentInput,
  ): Promise<Recruitment> {
    return this.recruitmentService.create({ createRecruitmentInput });
  }

  @Mutation(() => Recruitment)
  updateRecruitment(
    @Args('recruitmentId') recruitmentId: string,
    @Args('updateRecruitmentInput')
    updateRecruitmentInput: UpdateRecruitmentInput,
  ): Promise<Recruitment> {
    return this.recruitmentService.update({
      recruitmentId,
      updateRecruitmentInput,
    });
  }

  @Mutation(() => Boolean)
  deleteRecruitment(
    @Args('recruitmentId') recruitmentId: string,
  ): Promise<boolean> {
    return this.recruitmentService.delete({ recruitmentId });
  }

  @Mutation(() => Recruitment)
  applyRecruitment(
    @Args('userId') userId: string,
    @Args('recruitmentId') recruitmentId: string,
  ): Promise<Recruitment> {
    return this.recruitmentService.applyRecruitment({ userId, recruitmentId });
  }
}
