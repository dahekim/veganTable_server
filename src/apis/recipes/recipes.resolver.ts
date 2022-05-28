import { UseGuards } from "@nestjs/common";
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { CLASS_TYPE } from "../user/entities/user.entity";
import { CreateRecipesInput } from "./dto/createRecipes.input";
import { UpdateRecipesInput } from "./dto/updateRecipes.input";
import { Recipes } from "./entities/recipes.entity";
import { RecipesService } from "./recipes.service";


@Resolver()
export class RecipesResolver {
    constructor(
        private readonly recipesService: RecipesService,
    ) { }

    @Query(() => [Recipes])
    fetchRecipes(
        @Args({ name: 'page', nullable: true, type: () => Int }) page: number,
    ) {
        return this.recipesService.fetchRecipesAll();
    }

    @Query(() => Recipes)
    async fetchRecipeTypes(
        @Args('vegan_types') types: string,
    ) {
        return await this.recipesService.fetchRecipeTypes({ types });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => Recipes)
    async fetchMyRecipe(
        @Args('id') id: string,
        @Args('user_id') user_id: string,
    ) {
        return await this.recipesService.fetchMyRecipe({ id, user_id });
    }

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
        @CurrentUser() currentUser: ICurrentUser
    ) {
        console.log(createRecipesInput);
        return await this.recipesService.create(
            { createRecipesInput },
            currentUser
        );
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

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => [String])
    uploadRecipeImages(
        @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[]
    ) {
        return this.recipesService.uploadImages({ files })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => [String])
    deleteRecipeImages(
        @Args('id') recipe_id: string,
    ) {
        return this.recipesService.deleteImage({ recipe_id })
    }

    // @Query(()=> String)
    // searchRecipes(
    //     @Args('input') input: string,
    // ){
    //     return this.recipesService.search({input})
    // }

}