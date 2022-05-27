import { Module } from "@nestjs/common";
import { Recipes } from "src/apis/recipes/entities/recipes.entity";
import { SearchResolver } from "./search.resolver";
import { SearchService } from "./search.service";

@Module({
    imports:[Recipes],
    providers:[SearchResolver, SearchService],
})
export class SearchModule{}