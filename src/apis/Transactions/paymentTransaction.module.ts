import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { PaymentTransaction } from "./entities/paymentTransaction.entity";
import { IamportService } from "../iamport/iamport.service";
import { PaymentTransactionResolver } from "./paymentTransaction.resolver";
import { PaymentTransactionService } from "./paymentTransaction.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentTransaction,
            User
        ]),
    ],
    providers: [
        PaymentTransactionResolver,
        PaymentTransactionService,
        IamportService
    ],
})
export class PaymentTransactionModule { }