import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { 
    Column, 
    CreateDateColumn, 
    DeleteDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn
} from "typeorm";

export enum CLASS_TYPE{
    PRO='PRO',
    COMMON='COMMON',
}

export enum VEGAN_TYPE{
    VEGAN='VEGAN',
    LACTO='LACTO',
    OVO='OVO',
    LACTO_OVO='LACTO_OVO',
    PESCO='PESCO',
    POLLO='POLLO',
}

registerEnumType( CLASS_TYPE, {
    name: 'CLASS_TYPE',
})

registerEnumType( VEGAN_TYPE, {
    name: 'VEGAN_TYPE',
})


@Entity()
@ObjectType()
export class User{
    @PrimaryGeneratedColumn("uuid")
    @Field(()=>String)
    user_id!: string
    
    @Column({ unique: true, nullable: false })
    @Field(()=> String!)
    email!: string

    @Column({nullable: true})
    password: string

    @Column()
    @Field(()=>String!)
    name!: string

    @Column({ unique: true })
    @Field(()=> String!)
    phone: string

    @Column({type: "enum", enum: VEGAN_TYPE, default: null })
    @Field(()=>VEGAN_TYPE)
    type?: string

    @Column({ nullable: true })
    @Field(()=>String, { nullable: true })
    nickname?: string

    @Column({ type: "enum", enum: CLASS_TYPE, default: CLASS_TYPE.COMMON})
    @Field(()=> CLASS_TYPE, { nullable: true })
    isPro?: string

    @Column({default: false})
    @Field(()=>Boolean, { nullable: true })
    isSubs?: boolean

    // 프로필 이미지 추가 예정
    @Column({ nullable: true })
    @Field(() => String, { nullable: true })
    profilePic: string;

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    // @Column({default: null})
    // @Field(()=>String)
    // SubsHistory?: string

    @Column({ default: 0 })
    @Field(()=> Int)
    point?: number
}