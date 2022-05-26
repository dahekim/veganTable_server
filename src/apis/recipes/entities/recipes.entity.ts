import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RecipesImage } from "src/apis/recipesImage/entities/recipesImage.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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

    @Column({ default: " ", nullable: false })
    @Field(() => String)
    title: string;

    @Column({ default: " ", nullable: false })
    @Field(() => String)
    summary: string;

    @Column({ type: 'enum', enum: CATEGORY_TYPES, nullable: false })
    @Field(() => CATEGORY_TYPES)
    types: CATEGORY_TYPES;

    @Column({ nullable: true })
    @Field(() => [String], { nullable: true })
    steps: string;

    @Column({ nullable: true })
    @Field(() => [String], { nullable: true })
    images: string;

    @Column({ nullable: true })
    @Field(() => [String], { nullable: true })
    texts: string;

    @Column()
    @Field(() => Int)
    cookTime: number;

    @Column({ type: 'enum', enum: COOKING_LEVEL, nullable: false })
    @Field(() => COOKING_LEVEL)
    level: COOKING_LEVEL;

    @Column({ nullable: true })
    @Field(() => [String], { nullable: true })
    ingredients: string;

    @Column()
    @Field(() => Int)
    serve: number;

    @Column({ nullable: true })
    @Field(() => [String], { nullable: true })
    tags: string;

    @Column()
    @Field(() => String)
    thumbNail: string;

    @OneToMany(() => RecipesImage, (image_id) => image_id.recipes)
    @Field(() => [RecipesImage])
    image_id: RecipesImage[];

    @ManyToOne(() => User, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @Field(() => User)
    user?: User;

    @CreateDateColumn()
    createdAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}