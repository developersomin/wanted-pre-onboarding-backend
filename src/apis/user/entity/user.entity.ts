import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Recruitment } from '../../recruitment/entity/recruitment.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  @Column({ default: false })
  @Field(() => Boolean)
  apply: boolean;

  @ManyToMany(() => Recruitment, (recruitments) => recruitments.users)
  @Field(() => [Recruitment])
  recruitments: Recruitment[];
}
