import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { UserService } from "../user/user.service";
import { CreateRecipesInput } from "./dto/createRecipes.input";
import { UpdateRecipesInput } from "./dto/updateRecipes.input";
import { Recipes } from "./entities/recipes.entity";
import { RecipesService } from "./recipes.service";

@Resolver()
export class RecipesResolver {
    constructor(
        private readonly recipesService: RecipesService,
        private readonly userService: UserService,
    ) { }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Recipes])
    fetchRecipesAll() {
        return this.recipesService.fetchRecipesAll();
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Recipes)
    fetchRecipeTypes(
        @Args('recipes_id') id: string,
        @Args('vegan_types') typesCode: string,
    ) {
        return this.recipesService.fetchRecipeTypes({ id, typesCode });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Recipes)
    async createRecipe(
        @Args('createRecipesInput') createRecipesInput: CreateRecipesInput,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return await this.recipesService.create({
            user: currentUser,
            createRecipesInput
        });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Recipes)
    async updateRecipe(
        @Args('recipe_id') id: string,
        @Args('updateRecipesInput') updateRecipesInput: UpdateRecipesInput,
    ) {
        return await this.recipesService.update({ id, updateRecipesInput });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteRecipe(
        @Args('recipe_id') id: string,
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return await this.recipesService.delete({
            id,
            currentUser
        });
    }
}