import { Mutation, Resolver, Query, Args } from "@nestjs/graphql"
import { User } from "./entities/user.entity"
import { UserService } from "./user.service"
import { UpdateUserInput } from "./dto/updateUser.input"
import * as bcrypt from 'bcrypt'
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param"
import { UseGuards } from "@nestjs/common"
import { GqlAuthAccessGuard, GqlAuthRefreshGuard } from "src/commons/auth/gql-auth.guard"
import { UpdateUserDetailInput } from "./dto/updateUserDetail.input"
import { FileUpload, GraphQLUpload } from 'graphql-upload'


@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) { }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => User)
    async fetchUser(
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        const email = currentUser.email
        return await this.userService.findOne({ email })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [User])
    async fetchUsers() {
        return await this.userService.findAll()
    }

    @Mutation(() => User)
    async createUser(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('name') name: string,
        @Args('phone') phone: string,
    ) {
        const hashedPassword = await bcrypt.hash(password, 10)
        return this.userService.create({ email, hashedPassword, name, phone })
    }

    @Mutation(() => String)
    async getToken(@Args('phone') phone: string,) {
        return await this.userService.sendTokenToSMS({ phone })
    }

    @Mutation(() => String)
    async checkValidToken(
        @Args('phone') phone: string,
        @Args('token') token: string,
    ) {
        return await this.userService.isMatch({ phone, token })
    }


    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => User)
    async updateUser(
        @Args('user_id') user_id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
        return this.userService.update({ user_id, updateUserInput })
    }

    // @UseGuards(GqlAuthAccessGuard)
    // @Mutation(() => User)
    // async updateUserDetail(
    //     @Args('user_id') user_id: string,
    //     @Args('updateUserDetailInput') updateUserInput: UpdateUserDetailInput,
    // ) {
    //     return this.userService.update({ user_id, updateUserInput })
    // }

    // @UseGuards(GqlAuthAccessGuard)
    @Mutation(()=> String)
    async uploadProfileImage(
        @Args({ name: 'file', type: () => GraphQLUpload }) 
        file: FileUpload,
    ){
        return await this.userService.upload({ file });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => String)
    async deleteProfileImage(
        @Args('user_id') user_id: string, 
    ) {
        return await this.userService.deleteImage({ user_id })
    }


    @UseGuards(GqlAuthAccessGuard)
    @Mutation(()=>User)
    async deleteUser(
        @Args('user_id') user_id: string,
    ) {
        return this.userService.delete({ user_id })
    }
}