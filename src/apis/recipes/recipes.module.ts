import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recipes } from "./entities/recipes.entity";
import { RecipesResolver } from "./recipes.resolver";
import { RecipesService } from "./recipes.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            Recipes,
        ]),
    ],
    providers: [
        RecipesResolver,
        RecipesService,
    ]
})
export class RecipesModule { }