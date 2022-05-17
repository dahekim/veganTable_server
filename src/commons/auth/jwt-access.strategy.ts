import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor(
        // @Inject(CACHE_MANAGER)
        // private readonly cacheManager: Cache,
    ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'myAccessToken', // 수정해야함 ㅎㅎ
        passReqTocCallback: true,
    })
}

async validate(req, payload) {
    console.log("📍📍📍"+req)
    console.log("🔐🔐🔐"+payload)
    return {
        user_id: payload.sub,
        email: payload.email,
    } }
}