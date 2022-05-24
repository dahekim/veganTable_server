import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateRecipesInput {
    @Field(() => String)
    title: string;

    @Field(() => String)
    summary: string;

    @Field(() => String, { nullable: true })
    types?: string;

    @Field(() => String)
    desc: string;

    @Field(() => Int)
    cookTime: number;

    @Field(() => String, { nullable: true })
    level?: string;

    @Field(() => String)
    ingredients: string;

    @Field(() => String, { nullable: true })
    recipesPic: string;
}