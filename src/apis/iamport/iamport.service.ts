import {
    ConflictException,
    HttpException,
    Injectable,
    UnprocessableEntityException
} from "@nestjs/common";
import axios from "axios";
@Injectable()
export class IamportService {
    async getToken() {
        try {
            // 아임포트 계정의 API Key 값과 Secret Key 값으로 토큰 정보 얻기
            const result = await axios.post('https://api.iamport.kr/users/getToken', {
                imp_key: process.env.IAMPORT_API_KEY,
                imp_secret: process.env.IAMPORT_SECRET,
            });
            return result.data.response.access_token;

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

    async cancel({ impUid, token }) {
        try {
            const result = await axios.post(
                'https://api.iamport.kr/payments/cancel',
                { imp_uid: impUid },
                { headers: { Authorization: token } },
            );
            return result.data.response.cancel_amount;
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
}