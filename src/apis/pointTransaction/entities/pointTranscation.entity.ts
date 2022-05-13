import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { User } from "src/apis/users/entities/user.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

export enum POINT_TRANSACTION_STATUS_ENUM {
    PAYMENT = 'PAYMENT',
    CANCLE = 'CANCLE',
}
registerEnumType(POINT_TRANSACTION_STATUS_ENUM, {
    name: 'POINT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class PointTransaction { // Payment is Insert ONLY, not for Update and not for Delete
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String, { nullable: true })
    impUid: string;

    @Column()
    @Field(() => Int)
    amount: number;

    @Column({ type: 'enum', enum: POINT_TRANSACTION_STATUS_ENUM }) // paid, canceled... 
    @Field(() => POINT_TRANSACTION_STATUS_ENUM)
    status: POINT_TRANSACTION_STATUS_ENUM;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @CreateDateColumn()
    @Field(() => Date)
    createdAt: Date;

}