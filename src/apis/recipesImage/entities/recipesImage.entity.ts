import { Field, ObjectType } from "@nestjs/graphql";
import { Recipes } from "src/apis/recipes/entities/recipes.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class RecipesImage {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    image_id: string;

    @Column({ default: false })
    @Field(() => [String])
    urls: string;

    // @Column()
    // @Field(() => String)
    // thumbNail: string;

    @ManyToOne(() => Recipes, recipes => recipes.id, { nullable: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @Field(() => Recipes)
    recipes: Recipes;
    @Column()
    recipesId: String;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}