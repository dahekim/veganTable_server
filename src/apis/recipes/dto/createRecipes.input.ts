import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateRecipesInput {
    @Field(() => String, { nullable: false })
    title: string;

    @Field(() => String, { nullable: true })
    summary: string;

    @Field(() => String, { nullable: true })
    types: string;

    @Field(() => [String], { nullable: false })
    url: string[];

    @Field(() => [String], { nullable: false })
    description: string[];

    @Field(() => Int, { nullable: true })
    cookTime: number;

    @Field(() => String, { nullable: true })
    level: string;

    @Field(() => [String], { nullable: false })
    ingredients: string[];

    @Field(() => [String], { nullable: false })
    recipesTags: string[];

    @Field(() => Int)
    scrapCount: number;
}
