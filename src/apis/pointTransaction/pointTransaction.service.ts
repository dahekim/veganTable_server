import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { PointTransaction, POINT_TRANSACTION_STATUS_ENUM } from "./entities/pointTransaction.entity";

@Injectable()
export class PointTransactionService {
    constructor(
        @InjectRepository(PointTransaction)
        private readonly pointTransactionRepository: Repository<PointTransaction>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly connection: Connection,
    ) { }
    async create({ impUid, amount, currentUser }) {
        //queryRunner 등록
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();

        // 트랜잭션 시작
        await queryRunner.startTransaction('SERIALIZABLE');

        try {
            // 1. PointTrasaction 테이블에 거래 기록 1줄 생성
            const pointTransaction = await this.pointTransactionRepository.save({
                impUid,
                amount,
                user: currentUser,
                status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
            });
            await queryRunner.manager.save(pointTransaction);

            // throw new Error('Find new Error');

            // 2. 사용자의 소지금 확인
            // const user = await this.userRepository.findOneBy({ id: currentUser.id });

            const user = await queryRunner.manager.findOne(
                User,
                { id: currentUser.id },
                { lock: { mode: 'pessimistic_write' } },
            );

            // // 3. 사용자의 소지금 업데이트
            // await this.userRepository.update(
            //     { id: user.id },
            //     { point: user.point + amount },
            // );

            const updatedUser = this.userRepository.create({
                ...user,
                point: user.point + (amount * 0.1)
            });
            // this.userRepository.save(updatedUser);
            await queryRunner.manager.save(updatedUser);

            // +@ commit(성공 확정)
            await queryRunner.commitTransaction();

            // 4. 최종 결과 프론트엔드로 전송
            return pointTransaction;

        } catch (error) {
            // 처리 결과 되돌리기(Rollback)
            await queryRunner.rollbackTransaction();
        } finally {
            // 연결 해제(Release)
            await queryRunner.release();
        }
    }
}