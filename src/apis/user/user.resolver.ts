import { Mutation, Resolver, Query } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";

@Resolver()
export class UserResolver{
    constructor(
        private readonly userService: UserService,
    ){}
    @Query(()=>String)
    fetchUsers(){
        console.log("test")
    }

    @Mutation(()=> User)
    async createUser(){
        console.log("test")
    }
}