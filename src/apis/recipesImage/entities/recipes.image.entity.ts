import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Recipes } from "src/apis/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class RecipesImage {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    image_id: number

    @Column()
    @Field(() => String)
    url: string

    @Column({length: 5000 })
    @Field(()=> String)
    description: string

    @CreateDateColumn()
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(()=> Recipes)
    @Field(()=>Recipes)
    recipes: Recipes
}