import { InputType, OmitType } from "@nestjs/graphql";
import { Recipes } from "../entities/recipes.entity";

@InputType()
export class CreateRecipesInput
    extends OmitType(Recipes, ['id'], InputType) { }