import { Cache } from 'cache-manager'
import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
<<<<<<< HEAD
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN,
            passReqToCallback: true,
        })
    }

    async validate(req, payload) {
        const accessToken = req.headers.authorization.split(" ")[1]
        let isExist = await this.cacheManager.get(`accessToken:${accessToken}`)
        if (isExist) {
            throw new UnauthorizedException('로그아웃된 사용자입니다')
        }
        return {
            user_id: payload.sub,
            email: payload.email,
        }
=======
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.ACCESS_TOKEN,
        passReqToCallback: true,
    })
}

async validate(req,payload) {
    const accessToken = req.headers.authorization.split(" ")[1]
    let isExist = await this.cacheManager.get(`accessToken:${accessToken}`)
    if (isExist) {
        throw new UnauthorizedException('로그아웃된 사용자입니다')
>>>>>>> 2eedc02e8deb9c472ff6f5d6cee28c73b82179b3
    }
}