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

    async findAll({recipe_id, page}){
        const qb = await getRepository(RecipesReply)
        .createQueryBuilder('recipesReply')
        .leftJoinAndSelect('recipesReply.recipes', 'recipe')
        .leftJoinAndSelect('recipesReply.user', 'user')
        .where('recipe.id = :id', { id: recipe_id })

        const paging = qb.orderBy('recipesReply.reply_id', 'ASC')

        if(page){
            const result = await paging.take(12).skip((page-1) * 12).getManyAndCount()
            const [replies] = result
            const repliesAndPage = { replies, page }
            return repliesAndPage
        } else {
            const result = await paging.getManyAndCount()
            const [replies] = result
            const onlyReplies = { replies }
            return onlyReplies
        }
    }

    async create({currentUser, user_id, contents, recipe_id}){
        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction('REPEATABLE READ')
        
        try {
            const user = await queryRunner.manager.findOne(User, { user_id: currentUser.user_id })
            const recipe = await queryRunner.manager.findOne(Recipes, { id: recipe_id })
            const createRecipe = await this.recipesRepository.create({ ...recipe })
            
            const createReply = await this.recipesReplyRepository.create({
                recipes : createRecipe,
                contents: contents,
                user: user,
            })

            const updateReplyCount = await this.recipesRepository.create({
                ...recipe,
                replyCount: recipe.replyCount + 1
            })
            
            await queryRunner.manager.save(createRecipe)
            await queryRunner.manager.save(createReply)
            await queryRunner.manager.save(updateReplyCount)
            await queryRunner.commitTransaction()

            return "댓글이 정상적으로 등록되었습니다."
        } catch (error) {
            await queryRunner.rollbackTransaction()
            throw error
        } finally {
            await queryRunner.release()
        }
    }

    async update({ currentUser, reply_id, recipe_id, contents }) {
        const user = await this.userRepository.findOne({ user_id: currentUser.user_id })
        const recipe = await this.recipesRepository.findOne({ id: recipe_id })
        const reply = await this.recipesReplyRepository.findOne({reply_id})
        return await this.recipesReplyRepository.save({
            ...recipe,
            ...reply,
            contents,
            user,
        })
    }
    
    
    async delete({ currentUser, reply_id, recipe_id }) {
        const user = await this.userRepository.findOne({ user_id: currentUser.user_id })
        const recipe = await this.recipesRepository.findOne({ id: recipe_id })
        const reply = await this.recipesReplyRepository.findOne({reply_id})
        
        if (reply) {
            const result = await this.recipesReplyRepository.softDelete({reply_id})
            const updateReplyCount = await this.recipesRepository.save({
                ...recipe,
                user,
                replyCount: recipe.replyCount -1
        })
        return result.affected ? "댓글이 삭제되었습니다.": "댓글 삭제에 실패했습니다."
    }
    return "댓글이 정상적으로 삭제되었습니다."
    }
}
