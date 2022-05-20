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
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        const token = await this.iamportService.getToken();
        this.iamportService.checkPaid({ impUid, amount, token });

        await this.paymentTransactionService.checkDuplicate({ impUid });
        return await this.paymentTransactionService.createTransaction({ impUid, amount, currentUser });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => PaymentTransaction)
    async cancelTransaction(
        @Args('impUid') impUid: string,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        await this.paymentTransactionService.checkAlreadyCanceled({ impUid });
        await this.paymentTransactionService.checkHasCancelableAmount({
            impUid,
            currentUser,
        })
        const token = await this.iamportService.getToken();
        const canceledAmount = await this.iamportService.cancel({
            impUid,
            token,
        });
        return await this.paymentTransactionService.cancelTransaction({
            impUid,
            amount: canceledAmount,
            currentUser,
        });
        // return this.paymentTransactionService.cancelTransaction({ impUid, amount, currentUser })
    }


}