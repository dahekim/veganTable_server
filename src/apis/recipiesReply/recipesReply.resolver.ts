import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { RecipesReply } from "./entities/recipes.reply.entity";
import { RecipesReplyService } from "./recipesReply.service";

@Resolver()
export class RecipesReplyResolver {
    constructor(
        private readonly recipesReplyService: RecipesReplyService,
    ) { }

    @Query(() => [RecipesReply])
    async fetchReplies(
        @Args('id') recipe_id: string,
    ) {
        return await this.recipesReplyService.findAll({ recipe_id })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    async createReply(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('user_id') user_id: string,
        @Args('contents') contents: string,
        @Args('id') recipe_id: string
    ) {
        return await this.recipesReplyService.create({
            currentUser, user_id, contents, recipe_id
        })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    async updateReply(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('reply_id') reply_id: string,
        @Args('contents') contents: string,
    ) {
        return await this.recipesReplyService.update({ currentUser, reply_id, contents })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    async deleteRely(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('reply_id') reply_id: string,
    ) {
        return this.recipesReplyService.delete({ currentUser, reply_id })
    }
}