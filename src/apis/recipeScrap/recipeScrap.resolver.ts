import { UseGuards } from "@nestjs/common";
import { Query, Args, Mutation, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { Recipes } from "../recipes/entities/recipes.entity";
import { RecipeScrap } from "./entities/recipeScrap.entity";
import { RecipeScarpService } from "./recipeScrap.service";


@Resolver()
export class RecipeScrapResolver{
    constructor(
        private readonly recipeScarpService: RecipeScarpService
    ){}
    
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Recipes])
    async fetchMyScraps(
        @CurrentUser() currentUser: ICurrentUser,
    ){
        return await this.recipeScarpService.findAll({currentUser})
    }


    @UseGuards(GqlAuthAccessGuard)
    @Mutation(()=>RecipeScrap)
    async clickScrap(
        @Args('id') recipe_id: string,
        @CurrentUser() currentUser: ICurrentUser,
    ){
        return await this.recipeScarpService.scrap({recipe_id, currentUser})
    }
}