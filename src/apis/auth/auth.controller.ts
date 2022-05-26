import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
    user: Pick< User, 'email' | 'password' | 'name' | 'phone' >
}

@Controller("/")
export class AuthController {
    constructor( 
        private readonly authService: AuthService,
        private readonly userService: UserService,
        ) {}

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    async loginGoogle(
        @Req() req: Request & IOAuthUser, 
        @Res() res: Response,
        ) {
        // await this.authService.socialLogin({ req, res })
        let user = await this.userService.findOne({ email: req.user.email })
        if (!user) {
            user = await this.userService.create({
                email: req.user.email,  
                hashedPassword: req.user.password,
                name: req.user.name,
                phone: req.user.phone,
            })
        }
        this.authService.setRefreshToken({ user, res });
    }

    @Get('/naver')
    @UseGuards(AuthGuard('naver'))
    async loginNaver(
        @Req() req: Request & IOAuthUser, 
        @Res() res: Response
        ) {
        // await this.authService.socialLogin({req, res})
        let user = await this.userService.findOne({
            email : req.user.email})
            if(!user){
                user = await this.userService.create({
                    email: req.user.email,
                    hashedPassword: req.user.password,
                    name: req.user.name,
                    phone: req.user.phone,
                }) 
            }
        this.authService.setRefreshToken({ user, res })
        res.redirect("http://localhost:3000/")
    }

    @Get('/kakao')
    @UseGuards(AuthGuard('kakao'))
    async loginKakao(
        @Req() req: Request & IOAuthUser,
        @Res() res: Response
        ) {
        // await this.authService.socialLogin({req, res});
        let user = await this.userService.findOne({
            email : req.user.email})
            if(!user){
                user = await this.userService.create({
                    email: req.user.email,
                    hashedPassword: req.user.password,
                    name: req.user.name,
                    phone: req.user.phone,
                }) 
            }
        this.authService.setRefreshToken({ user, res })
        res.redirect("http://localhost:3000/")
    }
}
