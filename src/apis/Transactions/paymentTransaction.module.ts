import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { PaymentTransactionResolver } from "./paymentTransactions.resolver";
import { PaymentTransactionService } from "./paymentTransaction.service";
import { PaymentTransaction } from "./entities/paymentTransaction.entity";
import { IamportService } from "../iamport/iamport.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentTransaction,
            User,
        ]),
    ],
    providers: [
        PaymentTransactionResolver,
        PaymentTransactionService,
        IamportService,
    ],
})
export class PaymentTransactionModule { }