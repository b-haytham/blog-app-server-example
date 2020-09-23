import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";


@ObjectType()
@Entity()
export class Comment extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(()=>String)
    @Column()
    content: string


    @Field(()=> User)
    @ManyToOne(()=> User, (user)=> user.comments)
    creator: User


    @Field(()=>Post)
    @ManyToOne(()=> Post, (post)=> post.comments)
    post: Post


    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;

}
