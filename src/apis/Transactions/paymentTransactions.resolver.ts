import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/commons/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/commons/auth/gql-user.param";
<<<<<<< HEAD
import { IamportService } from "../iamport/iamport.service";
=======
>>>>>>> 01fe98a764dfda5f1b0170d04ae58605409dfb8a
import { PaymentTransaction } from "./entities/paymentTransaction.entity";
import { PaymentTransactionService } from "./paymentTransaction.service";

@Resolver()
export class PaymentTransactionResolver {
    constructor(
        private readonly paymentTransactionService: PaymentTransactionService,
        // private readonly iamportService: IamportService,
    ) { }

    // @UseGuards(GqlAuthAccessGuard)
    // @Query(() => [Transaction])
    // async fetchTransactionAll() {
    //     return await this.transactionService.fetchTransactionAll()
    // }


    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => PaymentTransaction)
<<<<<<< HEAD
    async createTransaction(
=======
    createPaymentTransaction(
>>>>>>> 01fe98a764dfda5f1b0170d04ae58605409dfb8a
        @Args('impUid') impUid: string,
        @Args('amount') amount: number,
        @CurrentUser() currentUser: ICurrentUser,
    ) {
        // try {
        //     const getToken = await this.iamportService.getToken({ impUid, })
        // } catch {
        //     throw new console.error();

        // }
        return this.paymentTransactionService.create({ impUid, amount, currentUser });
    }
}