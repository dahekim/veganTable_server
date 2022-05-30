import { ConflictException, HttpException, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentTransaction } from "../Transactions/entities/paymentTransaction.entity";
import axios from "axios";

@Injectable()
export class IamportService {
    constructor(
        @InjectRepository(PaymentTransaction)
        private readonly paymentTransactionRepository: Repository<PaymentTransaction>,
    ) { }
    async getToken() {
        console.log("🧀토큰을 받긴 하는거니?")
        try {
            const token = await axios.post(
                'https://api.iamport.kr/users/getToken', {
                imp_key: process.env.IAMPORT_API_KEY,
                imp_secret: process.env.IAMPORT_SECRET,
            });
            console.log(token.data.response)
            return token.data.response.access_token;
        } catch (error) {
            console.log("💙👽 getToken Error!!!!")
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
                { headers: { Authorization: `Bearer ${token}` } },
            );
            console.log("🧶🧶🧶🧶🧶"+ result)
            // const doubleCheckImpUid = await this.paymentTransactionRepository.findOne({
            //     impUid,
            // });
            // if (doubleCheckImpUid) throw new ConflictException('이미 결제한 내역입니다.');
            if (result.data.response.status !== 'paid') throw new ConflictException('결제내역이 없습니다.');
            if (result.data.response.amount !== amount) throw new UnprocessableEntityException('결제 금액을 잘못 입력하셨습니다.')
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
    
    // async checkPaid({ impUid, accessToken, amount }){
    //     try{
    //         const result = await axios.get(
    //         `https://api.import.kr/payments/${impUid}`,
    //         { headers: {Authorization: accessToken} },
    //     )
    //         if (result.data.response.status !== "paid"){
    //             throw new ConflictException("결제 내역이 존재하지 않습니다.")
    //         }
    //         if(result.data.response.amount !== amount){
    //             throw new UnprocessableEntityException("결제 금액이 잘못되었습니다.")
    //         }
    //     } catch (error) {
    //         if(error?.response?.data?.message){
    //             throw new HttpException(
    //                 error.response.data.message,
    //                 error.response.status,
    //         )
    //         } else {
    //             throw error
    //         }
    //     }}

    async cancel({ impUid, token }) {
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