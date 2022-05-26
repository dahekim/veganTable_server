import { Field, InputType, Int } from "@nestjs/graphql";
// import GraphQLJSON from 'graphql-type-json';
@InputType()
export class CreateRecipesInput {
    @Field(() => String)
    title: string;

    @Field(() => String)
    summary: string;

    @Field(() => String)
    types: string;

    @Field(() => [String], { defaultValue: " " })
    image_urls: string[];

    // @Field(() => String)
    // texts: string;

    @Field(() => Int)
    cookTime: number;

    @Field(() => String)
    level: string;

    // @Field(() => String)
    // ingredients: string

    @Field(() => Int)
    serve: number;

    @Field(() => [String], { nullable: true })
    recipesPics: string[];
}