import { ConflictException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from "typeorm";
import { SUB_TYPE, User } from "../user/entities/user.entity";
import { PaymentTransaction, TRANSACTION_STATUS_ENUM } from "../Transactions/entities/paymentTransaction.entity";

@Injectable()
export class PaymentTransactionService {
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentTransactionRepository: Repository<PaymentTransaction>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection
    ) { }

    async fetchTransactionAll() {
        return await getRepository(PaymentTransaction)
            .createQueryBuilder('paymenttransaction')
            .leftJoinAndSelect('paymenttransaction.user', 'user')
            .orderBy('paymenttransaction.createdAt', 'DESC')
            .getMany();
    }

    async fetchimpUidwithUserid({ user_id }) {
        return await getRepository(PaymentTransaction)
            .createQueryBuilder('paymenttransaction')
            .leftJoinAndSelect('paymenttransaction.user', 'user')
            .where('user.user_id = :userUserId', { user_id })
            .orderBy('paymenttransaction.createdAt', 'DESC')
            .getMany();
    }

    async createTransaction({ impUid,amount,currentUser, status }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            const paymentTransaction = await this.paymentTransactionRepository.create({
                impUid,
                amount,
                user: currentUser.user_id,
                status: TRANSACTION_STATUS_ENUM.PAYMENT
            });
            await queryRunner.manager.save(paymentTransaction);

            const user = await queryRunner.manager.findOne(
                User,
                { user_id: currentUser.user_id },
                { lock: { mode: 'pessimistic_write' } },
            );

            const updatedUser = await this.userRepository.create({ ...user })

            await queryRunner.manager.save(updatedUser);
            await queryRunner.commitTransaction();

            return paymentTransaction;
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message || error?.response?.status) {
                console.log(error.response.data.message);
                console.log(error.response.status);
            } else {
                throw error;
            }
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async checkDuplicate({ impUid }) {
        const checkPaid = await this.paymentTransactionRepository.findOne({ impUid });
        if (checkPaid) throw new ConflictException('이미 결제 완료된 아이디입니다.');
    }

    async checkAlreadyCanceled({ impUid }) {
        const isExist = await this.paymentTransactionRepository.findOne({
            impUid,})
        const isCanceled = await this.paymentTransactionRepository.findOne({
            status: TRANSACTION_STATUS_ENUM.CANCEL,
        });
        if (isExist && isCanceled)
            throw new UnprocessableEntityException('이미 취소된 결제 내역입니다.')
    }

    async checkHasCancelableStatus({ impUid, currentUser }) {
        const isExist = await this.paymentTransactionRepository.findOne({ where: {impUid} })
        const isPaid = await this.paymentTransactionRepository.findOne({ where: {status: TRANSACTION_STATUS_ENUM.PAYMENT} })
        if (!isExist) throw new UnprocessableEntityException('결제 내역이 존재하지 않습니다.')
    }

    async cancelTransaction({ impUid, amount,currentUser}) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');
        try {
            const canceledTransaction = await this.createTransaction({
                impUid,
                amount: -amount,
                currentUser,
                status: TRANSACTION_STATUS_ENUM.CANCEL,
            });
            const updatedUser = this.userRepository.create({
                ...currentUser,
                isSubs: SUB_TYPE.NON_SUB,
            });

            await queryRunner.manager.save(canceledTransaction);
            await queryRunner.manager.save(updatedUser);
            await queryRunner.commitTransaction();
            return canceledTransaction;
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message || error?.response?.status) {
                console.log(error.response.data.message);
                console.log(error.response.status);
            } else {
                throw error;
            }
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}