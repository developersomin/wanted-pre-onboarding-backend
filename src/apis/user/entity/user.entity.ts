import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "@nestjs/graphql";
import {Recruitment} from "../../recruitment/entity/recruitment.entity";
import {UserRecruitment} from "../../userRecruitment/entity/user-recruitment.entity";

@Entity()
@ObjectType()
export class User{

    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id: string;

    @Column()
    @Field(()=>String)
    name: string;

    @Column({default: false})
    @Field(()=>Boolean)
    apply: boolean;

    @OneToMany(()=>UserRecruitment, userRecruitment=> userRecruitment.recruitment)
    @Field(()=>[UserRecruitment])
    userRecruitments: UserRecruitment[];
}