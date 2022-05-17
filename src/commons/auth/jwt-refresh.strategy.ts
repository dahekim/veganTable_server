import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
    constructor() {
    super({
        jwtFromRequest: (req) => req.headers.cookie.replace('refreshToken=', ''),
        secretOrKey: 'myRefreshToken',
        passReqToCallback: true,
    });
}

    validate(req,payload) {
        console.log("🖍🖍🖍"+req)
        console.log("📗📗📗"+payload)
        return {
            user_id: payload.sub,
            email: payload.email,
    } }
}
