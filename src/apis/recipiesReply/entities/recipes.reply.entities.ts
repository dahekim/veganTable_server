import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
@ObjectType()
export class RecipesReply {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string; 

    @Column()
    @Field(() => String)
    contents: string;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}