import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    getAccessToken({ user }) {
        return this.jwtService.sign(
            { email: user.email, sub: user.user_id },
            { secret: process.env.ACCESS_TOKEN, expiresIn: '1h' })
    }

    setRefreshToken({ user, res }) {
        const refreshToken = this.jwtService.sign(
            { email: user.email, sub: user.user_id },
            { secret: process.env.REFRESH_TOKEN, expiresIn: '2w' })

        // 개발환경
        // res.setHeader('Set-Cookie',`refreshToken=${refreshToken}; path=/;`)

        // 배포환경
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/')
        res.setHeader(
            'Set-Cookie',
            `refreshToken=${refreshToken}; path=/; domain=.itoutsider.shop; SameSite=None; Secure; httpOnly;`,
            )
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
            )
        }

    async socialLogin({ req, res }) {
        let user = await this.userService.findOne({
            email: req.user.email,
        })
        if (!user) {
            user = await this.userService.createSocial({
                email: req.user.email,
                hashedPassword: req.user.password,
                name: req.user.name,
                phone: req.user.phone,
            })

        }
        this.setRefreshToken({ user, res })
        res.redirect(
            302,
            "http://localhost:5501/frontend/login/index.html",
        );
    }
}
