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


    @Field(()=> [Comment])
    @OneToMany(()=>Comment, comm=> comm.post, {eager: true})
    @JoinTable()
    comments: Comment[]

    @Field()
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
