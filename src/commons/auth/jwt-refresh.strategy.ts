import { Cache } from 'cache-manager'
import {  CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
    constructor(
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
    ) {
        super({
            jwtFromRequest: (req) => {
                const refreshToken = req.headers.cookie.replace("refreshToken=", "")
                console.log(refreshToken)
                return refreshToken
            },
            secretOrKey: process.env.REFRESH_TOKEN,
            passReqToCallback: true,
        })
    }

    async validate(req, payload) {
        const refreshToken = req.headers.cookie.replace("refreshToken=", "")
        if (await this.cacheManager.get(`refreshToken:${refreshToken}`)) {
            throw new UnauthorizedException('이미 로그아웃된 사용자입니다');
    }
        return {
            user_id: payload.sub,
            email: payload.email,
        }
    }
}