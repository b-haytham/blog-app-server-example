import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field(()=> ID)
    @PrimaryGeneratedColumn()
    id!: number 

    @Column({unique: true})
    @Field()
    username!: string

    @Column({nullable: true})
    @Field({nullable: true})
    first_name: string

    @Column({nullable: true})
    @Field({nullable: true})
    last_name: string

    @Column({unique: true})
    @Field()
    email!: string

    @Column()
    password: string

    @Column({nullable: true})
    @Field({nullable: true})
    avatar: string

    @Column({nullable: true})
    @Field({nullable: true})
    studied_at: string

    @Column({nullable: true})
    @Field({nullable: true})
    work_at: string

    @Column({nullable: true})
    @Field({nullable: true})
    github: string

    @Column({nullable: true})
    @Field({nullable: true})
    facebook: string

    @Column({nullable: true})
    @Field({nullable: true})
    tweeter: string


    @CreateDateColumn()
    @Field(()=> String)
    created_at: Date

    @UpdateDateColumn()
    @Field(()=> String)
    updated_at: Date
}