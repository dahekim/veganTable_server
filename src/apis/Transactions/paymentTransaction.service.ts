import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';

import { Connection, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";

import { PaymentTransaction, TRANSACTION_STATUS_ENUM } from "./entities/paymentTransaction.entity";

@Injectable()
export class PaymentTransactionService {
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentTransactionRepository: Repository<PaymentTransaction>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection,
    ) { }
    async create({ impUid, amount, currentUser }) {
        //queryRunner 등록
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();

        // 트랜잭션 시작
        await queryRunner.startTransaction();

        try {
            // 1. Trasaction 테이블에 거래 기록 1줄 생성
            const transaction = await this.paymentTransactionRepository.save({
                impUid,
                amount,
                user: currentUser,
                status: TRANSACTION_STATUS_ENUM.PAYMENT,
            });
            await queryRunner.manager.save(transaction);

            // throw new Error('Find new Error');

            // 2. 사용자의 소지금 확인
            const user = await this.userRepository.findOne({ user_id: currentUser.id });

            // // 3. 사용자의 소지금 업데이트
            // await this.userRepository.update(
            //     { id: user.id },
            //     { point: user.point + amount },
            // );

            const updatedUser = this.userRepository.create({
                ...user,
                point: user.point + amount
            });
            // this.userRepository.save(updatedUser);
            await queryRunner.manager.save(updatedUser);

            // +@ commit(성공 확정)
            await queryRunner.commitTransaction();

            // 4. 최종 결과 프론트엔드로 전송
            return transaction;

        } catch (error) {
            // 처리 결과 되돌리기(Rollback)
            await queryRunner.rollbackTransaction();
        } finally {
            // 연결 해제(Release)
            await queryRunner.release();
        }
    }
}