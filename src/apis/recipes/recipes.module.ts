import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { Recipes } from "./entities/recipes.entity";
import { RecipesResolver } from "./recipes.resolver";
import { RecipesService } from "./recipes.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Recipes,
            User,
        ]),
    ],
    providers: [
        RecipesResolver,
        RecipesService,
        UserService,
    ]
})
export class RecipesModule { }