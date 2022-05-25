import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipesReply } from './entities/recipes.reply.entities';

@Injectable()
export class RecipesReplyService{
    constructor(
        @InjectRepository(RecipesReply)
        private readonly recipesReplyRepository: Repository<RecipesReply>,
    ){}

    findAll(){

    }

    findMine({user, user_id}){

    }

    create({user, user_id, contents}){

    }

    update({user_id, reply_id}){

    }
    
    delete({user_id, reply_id}){

    }
}
