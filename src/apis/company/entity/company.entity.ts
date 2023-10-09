import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Field, ObjectType} from "@nestjs/graphql";
import {Recruitment} from "../../recruitment/entity/recruitment.entity";

@Entity()
@ObjectType()
export class Company{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id: string;

    @Column()
    @Field(()=>String)
    name: string;

    @Column()
    @Field(()=>String)
    country: string;

    @Column()
    @Field(()=>String)
    area: string;
}