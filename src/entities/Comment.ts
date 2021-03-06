import { GraphQLJSONObject } from "graphql-type-json";
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

    @Field(()=>GraphQLJSONObject)
    @Column({type: 'json'})
    content: JSON


    @Field()
    @Column()
    creatorId: number
 
    @Field(()=> User)
    @ManyToOne(()=> User, (user)=> user.comments)
    creator: User


    @Field()
    @Column()
    postId: number

    @Field(()=>Post)
    @ManyToOne(()=> Post, (post)=> post.comments, {onDelete: 'CASCADE', onUpdate:'CASCADE'})
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
