import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() { // 검증(인가) 영역
        super({ // 여기서 넘겨받은 값을 PassportStrategy에 보내 검증 절차 실행
            /* "authorization" : "Bearer token" */
            // 복호화에 실패하면 이 단게에서 실행 정지 및 에러 송신
            // 서비스마다 입력이 필요한 내용은 각각 다름
            clientID:
                '847808470599-og194v8onf7ja95reklje7lb3h2a6k40.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/login/google',
            scope: ['email', 'profile'],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: any) { // 검증(인가) 완료 후 실행 영역
        // *.guard.ts의 context 안에 있는 request로 입력됨(명칭: user)
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        return {
            email: profile.emails[0].value,
            password: "111011101",
            name: profile.displayName,
            age: 34,
        };
    }
}