import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export enum CLASS_TYPE_ENUM {
    PRO = 'PRO',
    COMMON = 'COMMON',
}

export enum VEGAN_TYPE_ENUM {
    VEGAN = 'VEGAN',
    LACTO = 'LACTO',
    OVO = 'OVO',
    LACTO_OVO = 'LACTO_OVO',
    PESCO = 'PESCO',
    POLLO = 'POLLO'
}

registerEnumType(CLASS_TYPE_ENUM, {
    name: 'CLASS_TYPE_ENUM',
})

registerEnumType(VEGAN_TYPE_ENUM, {
    name: 'VEGAN_TYPE_ENUM',
})


@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    user_id: string

    @Column({ unique: true })
    @Field(() => String!)
    email: string

    @Column()
    password: string

    @Column()
    @Field(() => String!)
    name: string

    @Column()
    @Field(() => Int!)
    phone: number

    @Column({ type: "enum", enum: VEGAN_TYPE_ENUM })
    @Field(() => VEGAN_TYPE_ENUM)
    type: string

    @Column()
    @Field(() => String)
    nickname: string

    @Column({ type: "enum", enum: CLASS_TYPE_ENUM })
    @Field(() => CLASS_TYPE_ENUM)
    isPro: string

    @Column()
    @Field(() => Boolean)
    isSubs: boolean

    @Column()
    @Field(() => String)
    SubsHistory: string

    @Column({ default: 0 })
    @Field(() => Int)
    point: number

    @Column({ default: null })
    @Field(() => String, { nullable: true })
    url: string;

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}