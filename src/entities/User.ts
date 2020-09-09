import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class User {
    @Field(()=> ID)
    id!: number 

    @Field()
    username: string

}