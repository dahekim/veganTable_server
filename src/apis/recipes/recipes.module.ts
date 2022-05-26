import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtAccessStrategy } from "src/commons/auth/jwt-access.strategy";
import { RecipesReply } from "../recipiesReply/entities/recipes.reply.entity";
import { User } from "../user/entities/user.entity";
import { Recipes } from "./entities/recipes.entity";
import { RecipesResolver } from "./recipes.resolver";
import { RecipesService } from "./recipes.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([User,Recipes,RecipesReply]),
    ],
    providers: [
        RecipesResolver,
        RecipesService,
        JwtAccessStrategy
    ]
})
export class RecipesModule { }