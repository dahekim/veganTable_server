import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        ) {}

    getAccessToken({ user }) {
        return this.jwtService.sign(
            { email: user.email, sub: user.user_id },
            { secret: process.env.ACCESS_TOKEN, expiresIn: '10s' })
    }

    setRefreshToken({ user, res }) {
        const refreshToken = this.jwtService.sign(
            { email: user.email, sub: user.user_id },
            { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' }, )
            res.setHeader('Set-Cookie',`refreshToken=${refreshToken}; path=/;`)
        // 배포환경
        // res.setHeader('Access-Control-Allow-Origin', 'url')
        // res.setHeader(
            // 'Set-Cookie',
            // `refreshToken=${refreshToken}
        // )
        }

async socialLogin({req, res}) {
    let user = await this.userService.findOne({
    email: req.user.email,
    })
    if (!user) {
        user = await this.userService.create({
            email: req.user.email,
            hashedPassword: req.user.password,
            name: req.user.name,
            phone: req.user.phone,
        })
        console.log("😈😈😈😈😈회원으로 만들어요"+user)
    }
    this.setRefreshToken({ user, res })
    res.redirect(
        302,
        "http://localhost:5500/frontend/login/index.html",
        )
    }
}
