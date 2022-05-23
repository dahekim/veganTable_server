import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserDetailInput {
    @Field(()=>String, {nullable: true})
    address?: string

    @Field(()=> String, {nullable: true})
    type?: string

    @Field(()=> String, {nullable: true})
    nickname?: string    

    @Field(()=> String, {nullable: true})
    isPro?: string

    @Field(()=> Boolean, {nullable: true})
    isSubs?: boolean

    @Field(()=> String, {nullable: true})
    profilePic?: string
}