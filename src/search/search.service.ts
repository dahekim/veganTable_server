import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Recipes } from "src/apis/recipes/entities/recipes.entity";
import { Connection, Repository } from "typeorm";

@Injectable()
export class SearchService{
    constructor(
        // @InjectRepository(Recipes)
        // private readonly recipesRepository: Repository<Recipes>,

        private readonly connection: Connection,
    ){

    }
}