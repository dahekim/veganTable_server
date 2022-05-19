import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "refresh") {
    constructor() {
        super({
            jwtFromRequest: (req) => {
                console.log(req)
                const refreshToken = req.headers.cookie.replace("refreshToken=", "")
                console.log(refreshToken)
                return refreshToken
            },
            secretOrKey: process.env.REFRESH_TOKEN,
            passReqToCallback: true,
        })
    }

    validate(req, payload: any) {
        return {
            user_id: payload.sub,
            email: payload.email,
        }
    }
}