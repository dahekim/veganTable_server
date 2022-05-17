import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class GqlAuthAccessGuard extends AuthGuard('access') {
    // GraphQL에서 사용하는 검증 방식의 일부
    // REST 형식 기준으로 사용하는 AuthGuard() 대신
    // GraphQL의 기준에 맞춰 다시 요청 및 검증 영역 생성
    // getRequest(context) - REST -> ctx.getContext().req - GraphQL
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}

export class GqlAuthRefreshGuard extends AuthGuard('refresh') {
    // GraphQL에서 사용하는 검증 방식의 일부
    // REST 형식 기준으로 사용하는 AuthGuard() 대신
    // GraphQL의 기준에 맞춰 다시 요청 및 검증 영역 생성
    // getRequest(context) - REST -> ctx.getContext().req - GraphQL
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}