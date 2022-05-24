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

    async createTransaction({
        impUid,
        amount,
        currentUser,
        status = TRANSACTION_STATUS_ENUM.PAYMENT,
        isSubs = SUB_TYPE.NON_SUB,
    }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            const paymentTransaction = await this.paymentTransactionRepository.create({
                impUid,
                amount,
                user: currentUser,
                status,
            });
            await queryRunner.manager.save(paymentTransaction);

            const user = await queryRunner.manager.findOne(
                User,
                { user_id: currentUser.user_id },
                { lock: { mode: 'pessimistic_write' } },
            );

            const updatedUser = this.userRepository.create({
                ...user,
                isSubs,
            });

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
            // 처리 결과 되돌리기(Rollback)
            await queryRunner.rollbackTransaction();
        } finally {
            // 연결 해제(Release)
            await queryRunner.release();
        }
    }

    async checkDuplicate({ impUid }) {
        const checkPaid = await this.paymentTransactionRepository.findOne({ impUid });
        if (checkPaid) throw new ConflictException('이미 결제되었습니다.');
    }

    async checkAlreadyCanceled({ impUid }) {
        const checkAlready = await this.paymentTransactionRepository.findOne({
            impUid,
            status: TRANSACTION_STATUS_ENUM.CANCEL,
        });
        if (checkAlready)
            throw new UnprocessableEntityException('이미 결제 취소된 내역입니다.')
    }

    async checkHasCancelableStatus({ impUid, currentUser }) {
        const checkHasStatus = await this.paymentTransactionRepository.findOne({
            impUid,
            user: { user_id: currentUser.user_id },
            status: TRANSACTION_STATUS_ENUM.PAYMENT,
        });
        if (!checkHasStatus)
            throw new UnprocessableEntityException('결제 내역이 존재하지 않습니다.');
    }

    async cancelTransaction({
        impUid,
        amount,
        currentUser,
        isSubs = SUB_TYPE.BASIC || SUB_TYPE.PREMIUM }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            const canceledTransaction = await this.createTransaction({
                impUid,
                amount: -amount,
                currentUser,
                status: TRANSACTION_STATUS_ENUM.CANCEL,
                isSubs,
            });
            const updatedUser = this.userRepository.create({
                ...currentUser,
                isSubs: SUB_TYPE.NON_SUB,
            });

            await queryRunner.manager.save(canceledTransaction);
            await queryRunner.manager.save(updatedUser);
            // +@ commit(성공 확정)
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