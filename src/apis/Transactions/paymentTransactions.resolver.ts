import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { IamportService } from "../iamport/iamport.service";
import { PaymentTransaction } from "./entities/paymentTransaction.entity";
import { PaymentTransactionService } from "./paymentTransaction.service";

@Resolver()
export class PaymentTransactionResolver {
    constructor(
        private readonly paymentTransactionService: PaymentTransactionService,
        private readonly iamportService: IamportService,
    ) { }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [PaymentTransaction])
    async fetchTransactionAll() {
        return await this.paymentTransactionService.fetchTransactionAll()
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => PaymentTransaction)
    async fetchimpUidwithUserid(
        @Args('userid') user_id: string,
    ) {
        return this.paymentTransactionService.fetchimpUidwithUserid({ user_id })
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => PaymentTransaction)
    async createPaymentTransaction(
        @Args('imp_Uid') impUid: string,
        @Args('amount') amount: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        try {
            const getToken = await this.iamportService.getToken({ impUid: impUid })
        } catch {
            throw new console.error();
        }
        return await this.paymentTransactionService.createTransaction({ impUid, amount, currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => PaymentTransaction)
    async cancelTransaction(
        @Args('imp_Uid') impUid: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.iamportService.cancel({ impUid })
    }


}