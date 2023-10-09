import {Field, Int, ObjectType, PartialType, PickType} from "@nestjs/graphql";
import {Recruitment} from "../entity/recruitment.entity";

@ObjectType()
export class DetailRecruitmentOutput extends Recruitment{

    @Field(()=>[String])
    companyRecruitmentId: string[];
}