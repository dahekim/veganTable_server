import { ConflictException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { PaymentTransaction, TRANSACTION_STATUS_ENUM } from "./entities/paymentTransaction.entity";

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
            .createQueryBuilder('PaymentTransaction')
            .leftJoinAndSelect('PaymentTransaction.id', 'id')
            .leftJoinAndSelect('PaymentTransaction.impUid', 'impUid')
            .leftJoinAndSelect('PaymentTransaction.user', 'user')
            .orderBy('PaymentTransaction.createdAt', 'DESC')
            .getMany();
    }

    async fetchimpUidwithUserid({ user_id }) {
        return await getRepository(PaymentTransaction)
            .createQueryBuilder('PaymentTransaction')
            .leftJoinAndSelect('PaymentTransaction.user', 'user')
            .where('user.user_id =:userUserId', { user_id })
            .orderBy('PaymentTransaction.createdAt', 'DESC')
            .getMany();
    }

    async createTransaction({ impUid, amount, currentUser, }) {
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        //queryRunner 등록
        await queryRunner.startTransaction('SERIALIZABLE');
        try {
            // 트랜잭션 시작
            // 1. Trasaction 테이블에 거래 기록 1줄 생성
            const paymentTransaction = await this.paymentTransactionRepository.create({
                impUid,
                amount,
                user: currentUser,
                status: TRANSACTION_STATUS_ENUM.PAYMENT,
            });
            await queryRunner.manager.save(paymentTransaction);

            // 2. 사용자 정보 확인
            const user = await queryRunner.manager.findOne(
                User,
                { user_id: currentUser.user_id },
                { lock: { mode: 'pessimistic_write' } },
            );

            // // 3. 사용자 정보 업데이트
            // await this.userRepository.update(
            //     { id: user.id },
            //     { point: user.point + amount },
            // );
            const updatedUser = this.userRepository.create({
                ...user,
                isSubs: true
            });
            // this.userRepository.save(updatedUser);
            await queryRunner.manager.save(updatedUser);

            // +@ commit(성공 확정)
            await queryRunner.commitTransaction();
            // 4. 최종 결과 프론트엔드로 전송
            return paymentTransaction;
        } catch (error) {
            if (error?.response?.data?.message) {
                console.log(error.response.data.message);
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
            throw new ConflictException('이미 결제 취소된 내역입니다.');
    }

    async checkHasCancelableAmount({ impUid, currentUser }) {
        const checkHasAmount = await this.paymentTransactionRepository.findOne({
            impUid,
            user: { user_id: currentUser.user_id },
            status: TRANSACTION_STATUS_ENUM.PAYMENT,
        });
        if (!checkHasAmount)
            throw new UnprocessableEntityException('결제 내역이 존재하지 않습니다.');
    }
}