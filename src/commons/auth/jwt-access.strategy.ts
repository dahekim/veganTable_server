import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
    constructor() { // 검증(인가) 영역
        super({ // 여기서 넘겨받은 값을 PassportStrategy에 보내 검증 절차 실행
            /* "authorization" : "Bearer token" */
            // 복호화에 실패하면 이 단게에서 실행 정지 및 에러 송신
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'myAccessKey',
        });
    }

    validate(payload) { // 검증(인가) 완료 후 실행 영역
        // *.guard.ts의 context 안에 있는 request로 입력됨(명칭: user)
        console.log(payload);
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}