import {CreateRecruitmentInput} from "../dto/create-recruitment.input";
import {UpdateRecruitmentInput} from "../dto/update-recruitment.input";

export interface IRecruitmentServiceCreate{
    createRecruitmentInput: CreateRecruitmentInput;
}

export interface IRecruitmentServiceFindOne{
    recruitmentId: string;
}

export interface IRecruitmentServiceUpdate{
    recruitmentId: string,
    updateRecruitmentInput: UpdateRecruitmentInput
}

export interface IRecruitmentServiceDetailRecruitment{
    id: string,
    position: string,
    reward: number,
}

export interface IRecruitmentServiceSearch{
    search: string
}