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
    @Field(() => String)
    url: string;

    @Column()
    @Field(() => String)
    thumbNail: string;

    @ManyToOne(() => Recipes, (recipes) => recipes.image_id, { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @Field(() => Recipes, { nullable: true })
    recipes: Recipes;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}