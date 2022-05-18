import { ConflictException, HttpException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { Repository } from "typeorm";
import { PaymentTransaction, TRANSACTION_STATUS_ENUM } from "../Transactions/entities/paymentTransaction.entity";
import { User } from "../user/entities/user.entity";
@Injectable()
export class IamportService {
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
    ) { }
    async getToken({ impUid }) {
        try {
            // 아임포트 계정의 API Key 값과 Secret Key 값으로 토큰 정보 얻기
            const token = await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key: process.env.IAMPORT_API_KEY,
                imp_secret: process.env.IAMPORT_SECRET,
            });
            const { access_token } = token.data.response;
            const useToken = await axios.get(
                `https://api.iamport.kr/payments/${impUid}`,
                {
                    headers: {
                        authorization: `Bearer ${access_token}`,
                    },
                },
            );
            const { imp_Uid } = useToken.data.response;
            if (imp_Uid !== impUid)
                throw new UnprocessableEntityException('데이터가 존재하지 않습니다.')

            return token.data.response.access_token;

        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            );
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
            if (result.data.response.status !== amount)
                throw new UnprocessableEntityException('결제 금액을 잘못 입력하셨습니다.')
        } catch (error) {
            if (error?.response?.data?.message) {
                throw new HttpException(
                    error.response.data.message,
                    error.response.status,
                );
            } else {
                throw error;
            }
        }
    }

    async cancel({ impUid, currentUser }) {
        const impUsedinfo = await this.paymentTransactionRepository.findOne({ impUid })
        const { id, amount, status, createdAt, ...rest } = impUsedinfo;
        try {
            const token = await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key: process.env.IAMPORT_API_KEY,
                imp_secret: process.env.IAMPORT_SECRET,
            });
            const { access_token } = token.data.response;

            const getCancelPaid = await axios.post(
                'https://api.iamport.kr/payments/cancel',
                { imp_uid: impUid },
                { headers: { Authorization: access_token } },
            );
            const { canceledRes } = getCancelPaid.data;

            if (status === 'CANCEL') {
                const cancelSubsUpdate = await this.paymentTransactionRepository.create({
                    impUid,
                    createdAt,
                    amount: -amount,
                    status: TRANSACTION_STATUS_ENUM.CANCEL,
                    ...rest,
                });
                const cancelPayment = await this.paymentTransactionRepository.findOne({
                    impUid,
                    id: currentUser.user_id,
                });
                if (cancelPayment)
                    throw new UnprocessableEntityException('이미 취소된 결제 내역입니다.');
                await this.paymentTransactionRepository.save(cancelSubsUpdate);
            }
            return canceledRes.data.response.cancel_amount;
        } catch (error) {
            throw new HttpException(
                error.response.data.message,
                error.response.status,
            );
        }
    }
}