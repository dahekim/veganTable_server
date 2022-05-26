import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, getRepository, Repository } from "typeorm";
import { Recipes } from "../recipes/entities/recipes.entity";
import { User } from "../user/entities/user.entity";
import { RecipeScrap } from "./entities/recipeScrap.entity";

@Injectable()
export class RecipeScarpService{
    constructor(
        @InjectRepository(RecipeScrap)
        private readonly scrapRepository: Repository<RecipeScrap>,

        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,

        private readonly connection:Connection
    ){}
    async findAll({currentUser}){
        const scrapedRecipe =  await getRepository(Recipes)
        .createQueryBuilder('recipes')
        .leftJoinAndSelect('recipes.user','recipeUser')
        .leftJoinAndSelect('recipes.isScraped','recipeScraped')
        .leftJoinAndSelect('scraped.user','user')
        .where('recipeScrap.isScraped',{ scraped: true })
        .andWhere('recipeUser.user_id = :user_id',{ user_id : currentUser.user_id} )
        .andWhere('user.id = :id',{ user_id : currentUser.id} )
        .getMany()
        return scrapedRecipe
    }

    async scrap({recipe_id, currentUser}){
        const queryRunner = await this.connection.createQueryRunner()
        const queryBuilder = await this.connection.createQueryBuilder()
        await queryRunner.connect()
        await queryRunner.startTransaction('SERIALIZABLE')
        
        try {
            const recipe = await queryRunner.manager.findOne(
                Recipes,
                { id: recipe_id },
                { lock: { mode: 'pessimistic_write' } },
                )
                const user = await queryRunner.manager.findOne(User, {
                    user_id : currentUser.user_id,
                })
                const scrap = await queryRunner.manager.findOne( RecipeScrap, {
                    user: currentUser.user_id,
                    recipes: recipe_id,
                })

                if (!scrap) {
                    const createScrap = await this.scrapRepository.create({
                        scraped: true,
                        user: user,
                        recipes: recipe,
                    })
                    
                    const updateRecipeScrap = await this.recipesRepository.create({
                        ...recipe,
                        scrapCount: recipe.scrapCount + 1,
                    })
                    await queryRunner.manager.save(updateRecipeScrap)
                    const result = await queryRunner.manager.save(createScrap);
                    await queryRunner.commitTransaction()
                    return result
                }

                if (!scrap.scraped) {
                    const createScrap = await this.scrapRepository.create({
                        ...scrap,
                        scraped: true,
                    })
                    
                    const updateRecipeScrap = await this.recipesRepository.create({
                        ...recipe,
                        scrapCount: recipe.scrapCount + 1,
                    })
                    
                    await queryRunner.manager.save(updateRecipeScrap);

                    const result = await queryRunner.manager.save(createScrap);
                    await queryRunner.commitTransaction();
                    return result;
                }
                const createScrap = await this.scrapRepository.create({
                    ...scrap,
                    scraped: false,
                })

                const updateRecipeScrap = await this.recipesRepository.create({
                    ...recipe,
                    scrapCount: recipe.scrapCount - 1 })
                    
                    await queryRunner.manager.save(updateRecipeScrap)
                    const result = await queryRunner.manager.save(createScrap)
                    
                    await queryRunner.commitTransaction()
                    return result

        } catch (error) {
            await queryRunner.rollbackTransaction()

        } finally {
            await queryRunner.release();
        }
    }
}