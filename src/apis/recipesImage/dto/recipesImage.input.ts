import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class RecipesImageInput {
    @Field(() => [String])
    urls: string[];
}