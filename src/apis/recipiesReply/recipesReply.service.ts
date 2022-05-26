import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from 'typeorm';
import { Recipes } from '../recipes/entities/recipes.entity';
import { User } from '../user/entities/user.entity';
import { RecipesReply } from './entities/recipes.reply.entity';

@Injectable()
export class RecipesReplyService{
    constructor(
        @InjectRepository(RecipesReply)
        private readonly recipesReplyRepository: Repository<RecipesReply>,

        @InjectRepository(Recipes)
        private readonly recipesRepository: Repository<Recipes>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection,
    ){}

    async findAll({recipe_id}){
        return await getRepository(RecipesReply)
        .createQueryBuilder('recipesReply')
        .leftJoinAndSelect('recipesReply.recipe', 'recipe')
        .leftJoinAndSelect('recipesReply.user', 'user')
        .where('recipe.id = :id', { id: recipe_id })
        .orderBy('recipesReply.id', 'DESC')
        .getMany();

    }

    async create({currentUser, user_id, contents, recipe_id}){
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        
        try {
            const user = await queryRunner.manager.findOne(User, { user_id: currentUser.user_id })
            const recipe = await queryRunner.manager.findOne(Recipes, { id: recipe_id })
            const createRecipe = await this.recipesRepository.create({ ...recipe })
            
            const createReply = await this.recipesReplyRepository.create({
                recipes : createRecipe,
                contents: contents,
                user: user,
            })

            await queryRunner.manager.save(createRecipe)
            await queryRunner.manager.save(createReply)
            await queryRunner.commitTransaction()
            
            return createReply
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async update({ currentUser, reply_id, contents }) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const user = await queryRunner.manager.findOne(User, {
                user_id: currentUser.user_id,
            })
            const prevReply = await queryRunner.manager.findOne( Recipes, {
                id: reply_id,
            })
            const newContent = { ...prevReply, user: user, contents }

            const result = await this.recipesReplyRepository.create(newContent)

            await queryRunner.manager.save(result)
            await queryRunner.commitTransaction()
            return result
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }
    
    
    async delete({ currentUser, reply_id }) {
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const deleteReply = await this.recipesReplyRepository
            .createQueryBuilder('replies')
            .innerJoinAndSelect('replies.user', 'user')
            .innerJoinAndSelect('replies.recipes', 'recipes')
            .where('user.id = :userId', { userId: currentUser.id })
            .andWhere('replies.id = :Id', { Id: reply_id })
            .getOne()
            
            if (deleteReply) {
                await this.recipesReplyRepository.softDelete({ reply_id })
            const post = await this.recipesRepository.findOne({
                id: deleteReply.recipes.id,
            })
            
            const createQtBoard = await this.recipesRepository.create({
                ...post,
            })
            await queryRunner.manager.save(createQtBoard)
            await queryRunner.commitTransaction()
            return true;
        } else {await queryRunner.commitTransaction()
            return false
        }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error
        } finally {
            await queryRunner.release();
        }
    }
}
