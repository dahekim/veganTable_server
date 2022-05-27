import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RecipesIngredients } from "src/apis/recipesIngrediants/entities/recipesIngrediants.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RecipesTag } from "src/apis/recipesTag/entities/recipesTag.entity";

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

    @Column({ default: " " })
    @Field(() => String)
    title: string;

    @Column({ default: " " })
    @Field(() => String)
    summary: string;

    @Column({ type: 'enum', enum: CATEGORY_TYPES })
    @Field(() => CATEGORY_TYPES)
    types: CATEGORY_TYPES;


    @Column({ default: 0 })
    @Field(() => Int)
    cookTime: number;

    @Column({ type: 'enum', enum: COOKING_LEVEL })
    @Field(() => COOKING_LEVEL)
    level: COOKING_LEVEL;

    @ManyToOne(() => User)
    @Field(() => User)
    user: User;

    @JoinTable()
    @ManyToMany(() => RecipesIngredients, (ingredients) => ingredients.recipe)
    @Field(() => [RecipesIngredients])
    ingredients: RecipesIngredients[];

    @JoinTable()
    @ManyToMany(() => RecipesTag, (recipesTags) => recipesTags.recipe)
    @Field(() => [RecipesTag])
    recipesTags: RecipesTag[];

    @Column({ default: 0 })
    @Field(() => Int)
    scrapCount?: number;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}