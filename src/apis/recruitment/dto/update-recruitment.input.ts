import {InputType, PartialType, PickType} from "@nestjs/graphql";
import {CreateRecruitmentInput} from "./create-recruitment.input";

@InputType()
export class UpdateRecruitmentInput extends PickType(PartialType(CreateRecruitmentInput), [
    'position',
    'reward',
    'contents',
    'stack',
]) {
}