import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Recipes } from "./entities/recipes.entity";
import { RecipesResolver } from "./recipes.resolver";
import { RecipesService } from "./recipes.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Recipes,
        ]),
    ],
    providers: [
        RecipesResolver,
        RecipesService,
    ]
})
export class RecipesModule { }