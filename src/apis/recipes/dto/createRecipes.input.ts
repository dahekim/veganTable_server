import { Field, InputType, Int, OmitType } from "@nestjs/graphql";
import { Recipes } from "../entities/recipes.entity";

@InputType()
export class CreateRecipesInput {
    @Field(() => String, { nullable: false })
    title: string;

    @Field(() => String, { nullable: true })
    summary: string;

    @Field(() => String, { nullable: true })
    types: string;

    @Field(() => String, { nullable: true })
    desc: string;

    @Field(() => Int, { nullable: true })
    cookTime: number;

    @Field(() => String, { nullable: true })
    level: string;

    @Field(() => String, { nullable: true })
    ingredients: string;

    @Field(() => [String], { nullable: true })
    recipesPics: string[];
}