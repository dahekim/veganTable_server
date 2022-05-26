import { Field, ObjectType } from "@nestjs/graphql";
import { Recipes } from "src/apis/recipes/entities/recipes.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
@ObjectType()
export class RecipesReply {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    reply_id!: string; 

    @Column()
    @Field(() => String)
    contents!: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(()=> Recipes, (recipes)=> recipes.recipesReply, {nullable: true})
    @Field(()=> Recipes)
    recipes: Recipes

    @ManyToOne(() => User, (user) => user.recipesReply, { onDelete: 'CASCADE',onUpdate: 'CASCADE'})
    @Field(() => User)
    user: User;
}