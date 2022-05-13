import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum CATEGORY_STATUS {
    vegan = '비건',
    lacto = '락토',
    ovo = '오보',
    lacto_ovo = '락토-오보',
    pesco = '페스코',
    pollo = '폴로',
};
registerEnumType(CATEGORY_STATUS, {
    name: 'CATEGORY_STATUS',
});

export enum COOKING_LEVEL {
    simple = '쉬움',
    general = '보통',
    difficult = '어려움',
};
registerEnumType(COOKING_LEVEL, {
    name: 'COOKING_LEVEL',
});


@Entity()
@ObjectType()
export class Recipes {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    title: string;

    @Column()
    @Field(() => String)
    summary: string;

    @Column({ type: 'enum', enum: CATEGORY_STATUS })
    @Field(() => CATEGORY_STATUS)
    status: CATEGORY_STATUS;

    @Column()
    @Field(() => String)
    desc: string;

    @Column()
    @Field(() => String)
    cooktime: string;

    @Column({ type: 'enum', enum: COOKING_LEVEL })
    @Field(() => COOKING_LEVEL)
    level: COOKING_LEVEL;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}