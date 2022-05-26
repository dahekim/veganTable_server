import { Field, InputType, Int } from "@nestjs/graphql";
import { RecipesImage } from "src/apis/recipesImage/entities/recipesImage.entity";
// import GraphQLJSON from 'graphql-type-json';
@InputType()
export class CreateRecipesInput {
    @Field(() => String)
    title: string;

    @Field(() => String)
    summary: string;

    @Field(() => String)
    types: string;

    @Field(() => [String])
    steps: string[];

    @Field(() => [String])
    images: string[];

    @Field(() => [String])
    texts: string[];

    @Field(() => Int)
    cookTime: number;

    @Field(() => String)
    level: String;

    @Field(() => [String])
    ingredients: string[];

    @Field(() => Int)
    serve: number;

    @Field(() => [String])
    tags: string[];

    @Field(() => RecipesImage)
    recipesImage: RecipesImage;
}