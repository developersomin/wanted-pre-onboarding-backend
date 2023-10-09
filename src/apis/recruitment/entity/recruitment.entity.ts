import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from '../../company/entity/company.entity';
import { UserRecruitment } from '../../userRecruitment/entity/user-recruitment.entity';

@Entity()
@ObjectType()
export class Recruitment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  position: string;

  @Column()
  @Field(() => Int)
  reward: number;

  @Column()
  @Field(() => String)
  contents: string;

  @Column()
  @Field(() => String)
  stack: string;

  @ManyToOne(() => Company)
  @Field(() => Company)
  company: Company;

  @OneToMany(
    () => UserRecruitment,
    (userRecruitment) => userRecruitment.recruitment,
  )
  @Field(() => [UserRecruitment])
  userRecruitments: UserRecruitment[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
