import { InputType, PartialType } from "@nestjs/graphql";
import { CreateRecipesInput } from "./createRecipes.input";

@InputType()
export class UpdateRecipesInput
    extends PartialType(CreateRecipesInput) { }

    // "code": "ER_DUP_ENTRY",
    //       "errno": 1062,
    //       "sqlState": "23000",