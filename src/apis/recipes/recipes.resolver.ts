import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { RecipesImage } from "../recipesImage/entities/recipes.image.entity";
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
    fetchRecipes() {
        return this.recipesService.fetchRecipesAll();
    }

    @Query(() => Recipes)
    fetchRecipe(
        @Args('userid') user_id: string,
    ) {
        return this.recipesService.fetchRecipesTitlewithUserid({ user_id });
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

    @Mutation(()=> [String])
    uploadRecipeImage(
        @Args({name:'files', type: () => [ GraphQLUpload ]}) files: FileUpload[]
    ){
        return this.recipesService.uploadImage({files})
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