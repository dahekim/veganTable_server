import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { UserService } from "../user/user.service";
import { RecipesReply } from "./entities/recipes.reply.entities";
import { RecipesReplyService } from "./recipesReply.service";

@Resolver()
export class RecipesReplyResolver{
    constructor(
        private readonly recipesReplyService: RecipesReplyService,
    ){}

    @Query(()=>[RecipesReply])
    async fetchReplies(
        @Args('id') id: string,
    ){
        return await this.recipesReplyService.findAll(id)
    }

    @Query(()=>[RecipesReply])
    async fetchMyReplies(
        @CurrentUser() user: ICurrentUser,
        @Args('user_id') user_id: string,
    ){
        return await this.recipesReplyService.findMine({user, user_id})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(()=>String)
    async createReply(
        @CurrentUser() user: ICurrentUser,
        @Args('user_id') user_id: string,
        @Args('contents') contents: string,
        @Args('id') id: string
    ){
        return await this.recipesReplyService.create({
            user, user_id, contents, id
        })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(()=>String)
    async updateReply(
        @CurrentUser() user: ICurrentUser,
        @Args('reply_id') reply_id: string,
        @Args('contents') contents: string,
    ){
        return await this.recipesReplyService.update({user, reply_id, contents})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(()=>String)
    async deleteRely(
        @CurrentUser() user: ICurrentUser,
        @Args('reply_id') reply_id: string,
    ){
        return this.recipesReplyService.delete({user, reply_id})
    }
}