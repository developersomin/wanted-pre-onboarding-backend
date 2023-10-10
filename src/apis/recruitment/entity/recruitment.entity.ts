import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Company } from '../../company/entity/company.entity';
import { User } from '../../user/entity/user.entity';

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

  @JoinTable()
  @ManyToMany(() => User, (users) => users.recruitments)
  @Field(() => [User])
  users: User[];

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;
}
