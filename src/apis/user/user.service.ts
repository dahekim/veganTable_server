import { CACHE_MANAGER, ConflictException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cache } from 'cache-manager'
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import axios from 'axios'

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ){}

    async findAll(){
        return await this.userRepository.find()
    }

    async findOne({ email }) {
        return await this.userRepository.findOne({ email })
    }

    async findWithDelete() {
        return await this.userRepository.find({
            withDeleted: true,
        })
    }

    async create({ email, hashedPassword: password, name, phone }){
        const user = await this.userRepository.findOne({ email })
        if(user) throw new ConflictException("이미 등록된 이메일입니다.")

        return await this.userRepository.save({ email, password, name, phone })
    }

    async createSocial({email, hashedPassword:password, name, phone }){
        const user = await this.userRepository.findOne({ email })
        if(user) throw new ConflictException("이미 등록된 소셜 계정입니다.")

        return await this.userRepository.save({email, password, name, phone })
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

    async delete({user_id}){
        const result = await this.userRepository.softDelete({
            user_id: user_id
        })
        return result.affected ? true: false
    }

    async sendTokenToSMS({ phone }) {
        const token = String(Math.floor(Math.random() * 10 ** 6)).padStart(6, "0")
        
        const appKey = process.env.SMS_APP_KEY
        const XSecretKey = process.env.SMS_X_SECRET_KEY
        const sender = phone

        await axios.post(
            `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`,
            { 
                body : `채식한상 가입 인증번호는 [${token}] 입니다.`,
                sendNo : sender,
                recipientList : [ { internationalRecipientNo: phone } ]    
            },
            {
                headers:{
                    "Content-Type" : "application/json;charset=UTF-8",
                    "X-Secret-Key" : XSecretKey,
                }
            },
        )
        const myToken = await this.cacheManager.get(phone)
        if (myToken) await this.cacheManager.del(phone)
        await this.cacheManager.set(phone, token, 
            {
            ttl: 180,
        })

        return `${phone} 으로 토큰번호 '${token}'을 전송했습니다.`
    }

    async isMatch({ phone, token }) {
        const myToken = await this.cacheManager.get(phone);
    
        if (myToken === token) {
            await this.cacheManager.del(phone)
            return true
        }
        return false
    }
}