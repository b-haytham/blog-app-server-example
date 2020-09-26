import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Comment } from "./Comment";
import { Post } from "./Post";
import { User } from "./User";



@ObjectType()
@Entity()
export class Like extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(()=> String)
    @Column()
    parent: 'POST' | 'COMMENT'

    @Field({nullable: true})
    @Column({nullable: true})
    postId: number


    @Field({nullable: true})
    @Column({nullable: true})
    commentId: number

    creatorId: number

    @Field(()=> Post)
    @ManyToOne(()=>Post, post=> post.likes, {onDelete: 'CASCADE'})
    post: Post


    @Field(()=>Comment)
    @ManyToOne(()=> Comment, comm=> comm.likes, {onDelete: 'CASCADE'})
    comment: Comment

    @Field(()=>User)
    @ManyToOne(()=>User, user=>user.likes, {onDelete: 'CASCADE'})    
    creator: User

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;

}