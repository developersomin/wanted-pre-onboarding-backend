import {Field, ObjectType} from "@nestjs/graphql";
import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Recruitment} from "../../recruitment/entity/recruitment.entity";
import {User} from "../../user/entity/user.entity";

@Entity()
@ObjectType()
export class UserRecruitment{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id: string;

    @JoinColumn()
    @ManyToOne(()=>Recruitment)
    @Field(()=>Recruitment)
    recruitment: Recruitment;

    @JoinColumn()
    @ManyToOne(()=>User)
    @Field(()=>User)
    user: User;

}