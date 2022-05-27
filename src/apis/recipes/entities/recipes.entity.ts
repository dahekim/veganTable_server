import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RecipesIngredients } from "src/apis/recipesIngrediants/entities/recipesIngrediants.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RecipesImage } from "src/apis/recipesImage/entities/recipesImage.entity";
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

    @Column({ nullable: false })
    @Field(() => String)
    title: string;

    @Column()
    @Field(() => String)
    summary: string;

    @Column({ type: 'enum', enum: CATEGORY_TYPES })
    @Field(() => CATEGORY_TYPES)
    types: CATEGORY_TYPES;

    @Column()
    @Field(() => Int)
    cookTime: number;

    @Column({ type: 'enum', enum: COOKING_LEVEL })
    @Field(() => COOKING_LEVEL)
    level: COOKING_LEVEL;

    @ManyToOne(() => User, { nullable: true })
    @Field(() => User)
    user: User;

    @JoinTable()
    @ManyToMany(() => RecipesIngredients, (ingredients) => ingredients.recipes)
    @Field(() => [RecipesIngredients], { nullable: false })
    ingredients: RecipesIngredients[];

    @JoinTable()
    @ManyToMany(() => RecipesTag, (recipesTags) => recipesTags.recipe)
    @Field(() => [RecipesTag], { nullable: false })
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