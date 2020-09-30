import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Like } from "./Like";

import { User } from "./User";

enum TAGS {
    TECHNOLOGY,
    PROGRAMMING,
}

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    description: string;


    @Field({nullable: true})
    @Column({nullable: true})
    thumbnail?: string

    //content????
    @Field(() => String)
    @Column()
    content: string;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts)
    creator: User;


    @Field(()=> [Like])
    @JoinTable()
    @OneToMany(()=>Like, like=> like.post, {eager: true})
    likes: Like[]

    @Field(()=> [Comment])
    @OneToMany(()=>Comment, comm=> comm.post, {eager: true})
    @JoinTable()
    comments: Comment[]

    @Field({nullable: true})
    @Column({nullable: true})
    tags: TAGS;

    @Field()
    @Column({ default: false })
    published: boolean;

    @Field(() => String)
    @CreateDateColumn()
    created_at: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updated_at: Date;
}
