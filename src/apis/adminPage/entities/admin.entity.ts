import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ADMIN_AUTH {
    ADMIN = 'ADMIN',
    COMMON = 'COMMON',
};

registerEnumType(ADMIN_AUTH, {
    name: 'ADMIN_AUTH',
});


@Entity()
@ObjectType()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    contents: string;

    @Column({ type: "enum", enum: ADMIN_AUTH, default: ADMIN_AUTH.COMMON })
    @Field(() => ADMIN_AUTH, { nullable: true })
    haveAuth?: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;




    @UpdateDateColumn()
    updatedAt: Date;


}