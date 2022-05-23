import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Recipes } from "./entities/recipes.entity";


@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,
    ) { }

    async findAll() {
        return await this.recipesRepository.find({})
    }
    async findOne({ id }) {
        return await this.recipesRepository.findOne({
            where: { id, }
        });
    }

    async create({ createRecipesInput }) {
        const result = await this.recipesRepository.save({
            ...createRecipesInput,
        });
        return result;
    }

    async update({ id, updateRecipesInput }) {
        const recipes = await this.recipesRepository.findOne({
            where: { id, }
        });

        const newRecipes = {
            ...recipes,
            ...updateRecipesInput,
        }
        return await this.recipesRepository.save(newRecipes);
    }

    async delete({ id }) {
        const result = await this.recipesRepository.softDelete({ id, });
        return result.affected ? true : false;
    }
}