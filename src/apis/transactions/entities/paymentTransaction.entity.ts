import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { User } from "src/apis/user/entities/user.entity";

import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

export enum TRANSACTION_STATUS_ENUM {
    PAYMENT = 'PAYMENT',
    CANCEL = 'CANCEL',
}
registerEnumType(TRANSACTION_STATUS_ENUM, {
    name: 'TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class PaymentTransaction { // Payment is Insert ONLY, not for Update and not for Delete
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    impUid: string;

    @Column()
    @Field(() => Int, { defaultValue: 0 })
    amount: number;

    @Column({ type: 'enum', enum: TRANSACTION_STATUS_ENUM }) // paid, canceled... 
    @Field(() => TRANSACTION_STATUS_ENUM)
    status: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @CreateDateColumn()
    createdAt: Date;

}