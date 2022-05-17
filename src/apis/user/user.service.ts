import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()

export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
    async findAll(){
        return await this.userRepository.find()
    }

    async create({email, hashedPassword: password, name, phone}){
        const user = await this.userRepository.findOne({email})
        if(user) throw new ConflictException("이미 등록된 이메일입니다.")
        
        console.log("💙💙💙 회원가입 완료!")
        return await this.userRepository.save({email, password, name, phone})
    }

    async update({user_id, updateUserInput}){
        const user = await this.userRepository.findOne({
            where: { user_id: user_id },
        })

        const updateUser = {
            ...user,
            ...updateUserInput,
        }
        return await this.userRepository.save(updateUser)
    }
}