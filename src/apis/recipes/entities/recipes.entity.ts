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
    @Field(() => String)
    id: string;

    @Column({ unique: true, nullable: false })
    @Field(() => String)
    title: string;

    @Column()
    @Field(() => String)
    summary: string;

    @Column({ type: 'enum', enum: CATEGORY_TYPES })
    @Field(() => CATEGORY_TYPES)
    types: CATEGORY_TYPES;

    @Column()
    @Field(() => String)
    desc: string;

    @Column()
    @Field(() => Int)
    cookTime: number;

    @Column({ type: 'enum', enum: COOKING_LEVEL })
    @Field(() => COOKING_LEVEL)
    level: COOKING_LEVEL;

    @Column()
    @Field(() => String)
    ingredients: string;

    @Column({ default: null, nullable: true })
    @Field(() => String, { nullable: true })
    recipesPic: string;

    @ManyToOne(() => User)
    @Field(() => User)
    user_id: User;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
    static title: any;
}