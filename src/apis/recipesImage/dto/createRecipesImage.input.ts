import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateRecipesImageInput {
    @Field(() => [Text], { nullable: false })
    url: string[];

    @Field(() => [String], { nullable: false })
    description: string[];
}