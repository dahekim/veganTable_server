import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Recipes } from "./entities/recipes.entity";


@Injectable()
export class RecipesService {
    constructor(
        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection
    ) { }

    async fetchRecipesAlll() {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .leftJoinAndSelect('recipes.user', 'user')
            .orderBy('recipes.createdAt', 'DESC')
            .getMany();
    }

    async fetchRecipesTitlewithUserid({ user_id }) {
        return await getRepository(Recipes)
            .createQueryBuilder('recipes')
            .select('recipes.title', 'title')
            .leftJoinAndSelect('recipes.user', 'user')
            .where('user.user_id = :userUserId', { user_id })
            .orderBy
    }

    async

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