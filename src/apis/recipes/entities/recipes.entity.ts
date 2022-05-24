import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum CATEGORY_TYPES {
    ALL = 'ALL',
    VEGAN = 'VEGAN',
    LACTO = 'LACTO',
    OVO = 'OVO',
    LACTO_OVO = 'LACTO-OVO',
    PESCO = 'PESCO',
    POLLO = 'POLLO',
};
registerEnumType(CATEGORY_TYPES, {
    name: 'CATEGORY_TYPES',
});

export enum COOKING_LEVEL {
    SIMPLE = 'SIMPLE',
    NORMAL = 'NORMAL',
    DIFFICULT = 'DIFFICULT',
};
registerEnumType(COOKING_LEVEL, {
    name: 'COOKING_LEVEL',
});


@Entity()
@ObjectType()
export class Recipes {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String, { nullable: true })
    id: string;

    @Column({ default: null })
    @Field(() => String, { nullable: true })
    title: string;

    @Column({ default: null })
    @Field(() => String, { nullable: true })
    summary: string;

    @Column({ type: 'enum', enum: CATEGORY_TYPES, default: null })
    @Field(() => CATEGORY_TYPES, { nullable: true })
    types: CATEGORY_TYPES;

    @Column({ default: null })
    @Field(() => String, { nullable: true })
    desc: string;

    @Column({ default: null })
    @Field(() => Int, { nullable: true })
    cookTime: number;

    @Column({ type: 'enum', enum: COOKING_LEVEL, default: null })
    @Field(() => COOKING_LEVEL, { nullable: true })
    level: COOKING_LEVEL;

    @Column({ default: null })
    @Field(() => String, { nullable: true })
    ingredients: string;

    @Column({ default: null, nullable: true })
    @Field(() => String, { nullable: true })
    recipesPic: string;

    @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
    @Field(() => User, { nullable: true })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    static title: any;
}