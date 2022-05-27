import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateRecipesImageInput {
    @Field(() => [String], { nullable: false })
    url: string[];

    @Field(() => [String], { nullable: false })
    description: string[];
}