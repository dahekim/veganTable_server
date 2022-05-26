import { Field, InputType, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RecipesReply } from "src/apis/recipiesReply/entities/recipes.reply.entities";
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export enum CLASS_TYPE {
    PRO = 'PRO',
    COMMON = 'COMMON',
}

export enum VEGAN_TYPE {
    NON_VEGAN = 'NON_VEGAN',
    VEGAN = 'VEGAN',
    LACTO = 'LACTO',
    OVO = 'OVO',
    LACTO_OVO = 'LACTO_OVO',
    PESCO = 'PESCO',
    POLLO = 'POLLO',
}

export enum SUB_TYPE {
    NON_SUB = 'NON_SUB',
    BASIC = 'BASIC',
    PREMIUM = 'PREMIUM',
}

registerEnumType(CLASS_TYPE, {
    name: 'CLASS_TYPE',
})

registerEnumType(VEGAN_TYPE, {
    name: 'VEGAN_TYPE',
})

registerEnumType(SUB_TYPE, {
    name: 'SUB_TYPE',
})

@Entity()
@InputType('user')
@ObjectType()
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Field(() => String)
    user_id!: string

    @Column({ nullable: false })
    @Field(() => String!)
    email!: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    @Field(() => String!)
    name!: string

    @Column({ nullable: false })
    @Field(() => String!)
    phone: string

    @Column({ default: null })
    @Field(() => String, { nullable: true })
    address?: string

    @Column({ type: "enum", enum: VEGAN_TYPE, default: VEGAN_TYPE.NON_VEGAN })
    @Field(() => VEGAN_TYPE, { nullable: true })
    type?: string

    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    nickname?: string

    @Column({ type: "enum", enum: CLASS_TYPE, default: CLASS_TYPE.COMMON })
    @Field(() => CLASS_TYPE, { nullable: true })
    isPro?: string

    @Column({ type: "enum", enum: SUB_TYPE, default: SUB_TYPE.NON_SUB })
    @Field(() => SUB_TYPE, { nullable: true })
    isSubs?: string;

    // 구독 개월 수
    @Column({ default: 0 })
    @Field(() => Int, { nullable: true })
    SubsHistory?: number

    // 시작 날짜
    @Column({ default: null })
    @Field(() => String, { nullable: true })
    startDate?: string

    // 종료 날짜
    @Column({ default: null })
    @Field(() => String, { nullable: true })
    endDate?: string

    @Column({ type: 'varchar', default: null, nullable: true })
    @Field(() => String, { nullable: true })
    profilePic: string;

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    // @ManyToOne()
    // @Field(()=>[RecipesReply])
    // userReply:RecipesReply[]
}