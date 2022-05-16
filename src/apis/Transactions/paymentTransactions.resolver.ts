import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
import { Transaction } from "typeorm";
import { IamportService } from "../iamport/iamport.service";
import { PaymentTransactionService } from "./paymentTransaction.service";

@Resolver()
export class PaymentTransactionResolver {
    constructor(
        private readonly paymentTransactionService: PaymentTransactionService,
        private readonly iamportService: IamportService,
    ) { }

    // @UseGuards(GqlAuthAccessGuard)
    // @Query(() => [Transaction])
    // async fetchTransactionAll() {
    //     return await this.transactionService.fetchTransactionAll()
    // }


    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Transaction)
    createPointTransaction(
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        return this.paymentTransactionService.create({ impUid, amount, currentUser });
    }
}