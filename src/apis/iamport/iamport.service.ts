import { ConflictException, HttpException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { PaymentTransaction } from "../transactions/entities/paymentTransaction.entity";

@Injectable()
export class IamportService {
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
    ) { }
    async getToken() {
        try {
            // 아임포트 계정의 API Key 값과 Secret Key 값으로 토큰 정보 얻기
            const token = await axios.post(
                'https://api.iamport.kr/users/getToken', {
                imp_key: process.env.IAMPORT_API_KEY,
                imp_secret: process.env.IAMPORT_SECRET,
            });
            return token.data.response.access_token;
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message || error?.response?.status) {
                throw new HttpException(
                    error.response.data.message,
                    error.response.status,
                );
            } else {
                throw error;
            }
        }
    }

    async checkPaid({ impUid, amount, token }) {
        try {
            const result = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`,
                { headers: { Authorization: token } },
            );
            const doubleCheckImpUid = await this.paymentTransactionRepository.findOne({
                impUid,
            });
            if (doubleCheckImpUid)
                throw new ConflictException('이미 결제한 내역입니다.');
            if (result.data.response.status !== 'paid')
                throw new ConflictException('결제하신 내역이 없습니다.');
            if (result.data.response.amount !== amount)
                throw new UnprocessableEntityException('결제 금액을 잘못 입력하셨습니다.')
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message || error?.response?.status) {
                throw new HttpException(
                    error.response.data.message,
                    error.response.status,
                );
            } else {
                throw error;
            }
        }
    }

    async cancel({ impUid, token }) {
        // const impUsedinfo = await this.paymentTransactionRepository.findOne({ impUid })
        // const { id, amount, status, createdAt, ...rest } = impUsedinfo;
        try {
            const canceledRes = await axios.post(
                'https://api.iamport.kr/payments/cancel',
                { imp_uid: impUid },
                { headers: { Authorization: token } },
            );
            return canceledRes.data.response.cancel_amount;
        } catch (error) {
            if (error?.response?.data?.message || error?.response?.status) {
                throw new HttpException(
                    error.response.data.message,
                    error.response.status,
                );
            } else {
                throw error;
            }
        }
    }
}