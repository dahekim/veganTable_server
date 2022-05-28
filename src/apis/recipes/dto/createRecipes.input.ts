import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateRecipesInput {
    @Field(() => String, { nullable: true })
    title: string;

    @Field(() => String, { nullable: true })
    summary: string;

    @Field(() => String, { nullable: true })
    types: string;

    @Field(() => [String], { defaultValue: " " })
    url: string[];

    @Field(() => [String], { defaultValue: " " })
    description: string[];

    @Field(() => Int, { defaultValue: 0 })
    cookTime: number;

    @Field(() => String, { nullable: true })
    level: string;

    @Field(() => [String], { defaultValue: " " })
    ingredients: string[];

    @Field(() => [String], { defaultValue: " " })
    recipesTags: string[];

    @Field(() => Int, { defaultValue: 0 })
    scrapCount: number;
}

// @InputType()
// export class CreateRecipesInput {
//     @Field(() => String)
//     title: string;

//     @Field(() => String)
//     summary: string;

//     @Field(() => String)
//     types: string;

//     @Field(() => [String])
//     url: string[];

//     @Field(() => [String])
//     description: string[];

//     @Field(() => Int)
//     cookTime: number;

//     @Field(() => String)
//     level: string;

//     @Field(() => [String])
//     ingredients: string[];

//     @Field(() => [String])
//     recipesTags: string[];

//     @Field(() => Int)
//     scrapCount: number;
// }
