import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Like } from "./Like";
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


    @Field(()=> [Like])
    @JoinTable()
    @OneToMany(()=>Like ,like=> like.comment, {eager: true})
    likes: Like[]

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;

}
