import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { RecipesImage } from "../recipesImage/entities/recipes.image.entity";
import { CLASS_TYPE } from "../user/entities/user.entity";
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
    fetchRecipes() {
        return this.recipesService.fetchRecipesAll();
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
        @Args({ name: 'image_urls', type: () => [String] }) image_urls: string[],
        @CurrentUser() currentUser: ICurrentUser
    ) {
        return await this.recipesService.create(
            { ...createRecipesInput },
            image_urls,
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

    // @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => [String])
    uploadRecipeImages(
        @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[]
    ) {
        return this.recipesService.uploadImages({ files })
    }

    // @UseGuards(GqlAuthAccessGuard)
    // @Mutation(()=> RecipesImage )
    // deleteRecipeImage(
    //     @CurrentUser() user: ICurrentUser,
    //     @Args('id') recipe_id: string,
    //     @Args('image_id') image_id: string
    // ){
    //     return this.recipesService.deleteImage({user, recipe_id, image_id})
    // }
}