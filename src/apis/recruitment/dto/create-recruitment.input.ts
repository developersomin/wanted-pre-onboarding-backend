import {Field, InputType, Int} from "@nestjs/graphql";
import {Min} from "class-validator";

@InputType()
export class CreateRecruitmentInput{

    @Field(()=>String)
    position: string;

    @Field(() => Int)
    @Min(0)
    reward: number;

    @Field(()=>String)
    contents :string;

    @Field(()=>String)
    stack: string;

    @Field(()=>String)
    companyId: string;
}