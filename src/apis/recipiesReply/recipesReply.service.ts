import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Recipes } from '../recipes/entities/recipes.entity';
import { User } from '../user/entities/user.entity';
import { RecipesReply } from './entities/recipes.reply.entities';

@Injectable()
export class RecipesReplyService{
    constructor(
        // @InjectRepository(RecipesReply)
        // private readonly recipesReplyRepository: Repository<RecipesReply>,

        // @InjectRepository(Recipes)
        // private readonly recipesRepository: Repository<Recipes>,

        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        
        // private readonly connection: Connection
    ){}

    findAll(id){

    }

    findMine({user, user_id}){

    }

    create({user, user_id, contents, id}){

    }

    update({user, reply_id, contents}){

    }
    
    delete({user, reply_id}){

    }
}
