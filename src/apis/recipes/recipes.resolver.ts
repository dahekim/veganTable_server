import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { CLASS_TYPE } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { CreateRecipesInput } from "./dto/createRecipes.input";
import { UpdateRecipesInput } from "./dto/updateRecipes.input";
import { Recipes } from "./entities/recipes.entity";
import { RecipesService } from "./recipes.service";
// import GraphQLJSON from 'graphql-type-json'

@Resolver()
export class RecipesResolver {
    constructor(
        private readonly recipesService: RecipesService,
    ) { }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Recipes])
    async fetchRecipesAll() {
        return await this.recipesService.fetchRecipesAll();
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Recipes)
    async fetchRecipeTypes(
        @Args('recipes_id') id: string,
        @Args('vegan_types') typesCode: string,
    ) {
        return await this.recipesService.fetchRecipeTypes({ id, typesCode });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Recipes)
    async fetchMyRecipe(
        @Args('id') id: string,
        @Args('user_id') user_id: string,
    ) {
        return await this.recipesService.fetchMyRecipe({ id, user_id });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Recipes)
    async fetchRecipeIsPro(
        @Args('isPro') isPro: CLASS_TYPE.PRO,
    ) {
        return await this.recipesService.fetchRecipeIsPro({ isPro });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Recipes)
    async createRecipe(
        @Args('createRecipesInput') createRecipesInput: CreateRecipesInput,
        // @Args({ name: 'desc', type: () => [GraphQLJSON] }) desc: JSON,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return await this.recipesService.create({
            createRecipesInput,
            currentUser,
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