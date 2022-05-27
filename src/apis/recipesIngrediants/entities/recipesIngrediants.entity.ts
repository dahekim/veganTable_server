import { Field, ObjectType } from "@nestjs/graphql";
import { Recipes } from "src/apis/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class RecipesIngredients {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column({ default: " " })
    @Field(() => String, { defaultValue: " ", nullable: false })
    name: string;

    // @Column()
    // @Field(() => Int)
    // amount: number;

    // @Column()
    // @Field(() => String)
    // unit: string;

    @ManyToMany(() => Recipes, (recipes) => recipes.ingredients)
    @Field(() => [Recipes])
    recipe: Recipes[];

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}