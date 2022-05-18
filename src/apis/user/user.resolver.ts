import { Mutation, Resolver, Query, Args } from "@nestjs/graphql"
import { User } from "./entities/user.entity"
import { UserService } from "./user.service"
import { UpdateUserInput } from "./dto/updateUser.input"
import * as bcrypt from 'bcrypt'
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param"
import { UseGuards } from "@nestjs/common"
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard"
import { UpdateUserDetailInput } from "./dto/updateUserDetail.input"


@Resolver()
export class UserResolver{
    constructor(
        private readonly userService: UserService,
    ){}

    @UseGuards(GqlAuthAccessGuard)
    @Query(()=>User)
    async fetchUser(
        @CurrentUser() currentUser: ICurrentUser,
    ){
        console.log("💖 💖 💖 회원정보 조회합니다" + currentUser)
        const email = currentUser.email
        return await this.userService.findOne({email})
    }
    
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [User])
    async fetchUsers(){
        console.log("🧡 🧡 🧡 회원정보 죄다 불러와요!")
        return await this.userService.findAll()
}

    @Mutation(()=> User)
    async createUser(
        @Args('email') email: string, 
        @Args('password') password: string, 
        @Args('name') name: string,
        @Args('phone') phone: string,
    ){
        const hashedPassword = await bcrypt.hash(password, 10)
        return this.userService.create({email, hashedPassword, name, phone})
    }

    @Mutation(()=> User)
    async updateUser(
        @Args('user_id') user_id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ){
        console.log("❤️‍🔥❤️‍🔥❤️‍🔥 회원정보 수정 완료!")
        return this.userService.update({user_id, updateUserInput})
    }

    @Mutation(()=>User)
    async updateUserDetail(
        @Args('user_id') user_id: string,
        @Args('updateUserDetailInput') updateUserInput: UpdateUserDetailInput,
    ){
        console.log("💘 💘 💘 회원정보 추가 기입 완료!")
        return this.userService.update({user_id, updateUserInput})
    }
}