import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateRecipesInput } from "./dto/createRecipes.input";
import { UpdateRecipesInput } from "./dto/upgradeRecipes.input";
import { Recipes } from "./entities/recipes.entity";
import { RecipesService } from "./recipes.service";

@Resolver()
export class RecipesResolver {
    constructor(
        private readonly recipesService: RecipesService,
    ) { }

    @Query(() => [Recipes])
    fetchRecipesAll() {
        return this.recipesService.fetchRecipesAll();
    }

    @Query(() => Recipes)
    fetchRecipeTypes(
        @Args('recipes_id') id: string,
        @Args('vegan_types') typesCode: string,
    ) {
        return this.recipesService.fetchRecipeTypes({ id, typesCode });
    }

    @Mutation(() => Recipes)
    async createRecipe(
        @Args('createRecipesInput') createRecipesInput: CreateRecipesInput,
    ) {
        return await this.recipesService.create({ createRecipesInput });
    }

    @Mutation(() => Recipes)
    async updateRecipe(
        @Args('recipe_id') id: string,
        @Args('updateRecipesInput') updateRecipesInput: UpdateRecipesInput,
    ) {
        return await this.recipesService.update({ id, updateRecipesInput });
    }

    @Mutation(() => Boolean)
    deleteRecipe(
        @Args('recipe_id') id: string,
    ) {
        return this.recipesService.delete({ id });
    }
}