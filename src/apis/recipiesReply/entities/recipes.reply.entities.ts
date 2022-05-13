import { Field, ObjectType } from "@nestjs/graphql";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
@ObjectType()
export class RecipesReply {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;

    @Column()
    @Field(() => String)
    contents: string;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}