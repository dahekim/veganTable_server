import {
    // CACHE_MANAGER, Inject, 
    Injectable,
    // UnauthorizedException 
}
    from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, "access") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN,
            // passReqTocCallback: true,
        })
    }

    async validate(
        // req, 
        payload) {
        // console.log("📍📍📍"+req)
        // console.log("🔐🔐🔐"+payload)
        return {
            user_id: payload.sub,
            email: payload.email,
        }
    }
}