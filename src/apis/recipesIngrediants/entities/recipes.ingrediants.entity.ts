import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export class RecipesIngrediants {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    name: string;

    // @Column()
    // @Field(() => String)


    // @Column()
    // @Field(() => Int)
    // amount: number;

    // @Column()
    // @Field(() => String)
    // unit: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}