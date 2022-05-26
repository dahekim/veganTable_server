import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recipes } from "../recipes/entities/recipes.entity";
import { User } from "../user/entities/user.entity";
import { RecipeScrap } from "./entities/recipeScrap.entity";
import { RecipeScrapResolver } from "./recipeScrap.resolver";
import { RecipeScarpService } from "./recipeScrap.service";

@Module({
    imports:[TypeOrmModule.forFeature([RecipeScrap, Recipes, User])],
    providers:[RecipeScarpService, RecipeScrapResolver]
})
export class RecipeScrapModule{}
