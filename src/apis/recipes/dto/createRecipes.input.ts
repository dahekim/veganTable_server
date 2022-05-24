import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class CreateRecipesInput {
    @Field(() => String, { nullable: false })
    title: string;

    @Field(() => String, { nullable: true })
    summary: string;

    @Field(() => String, { nullable: true })
    types: string;

    @Field(() => String, { nullable: true })
    desc: { image: string, text: string };

    @Field(() => Int, { nullable: true })
    cookTime: number;

    @Field(() => String, { nullable: true })
    level: String;

    @Field(() => String, { nullable: true })
    ingredients: string;

    @Field(() => Int, { nullable: true })
    serve: number;

    @Field(() => [String], { nullable: true })
    tags: string;

    @Field(() => String, { nullable: true })
    thumbNailPic: string;

    @Field(() => String, { nullable: true })
    recipesPic: string;
}