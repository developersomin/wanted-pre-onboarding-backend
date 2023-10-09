import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRecruitmentService } from './user-recruitment.service';
import { UserRecruitment } from './entity/user-recruitment.entity';

@Resolver()
export class UserRecruitmentResolver {
  constructor(
    private readonly userRecruitmentService: UserRecruitmentService,
  ) {}

  @Query(() => UserRecruitment)
  findAll(): Promise<UserRecruitment[]> {
    return this.userRecruitmentService.findAll();
  }

  @Mutation(() => UserRecruitment)
  apply(
    @Args('userId') userId: string,
    @Args('recruitmentId') recruitmentId: string,
  ): Promise<UserRecruitment> {
    return this.userRecruitmentService.apply({ userId, recruitmentId });
  }
}
