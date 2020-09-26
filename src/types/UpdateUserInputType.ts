import { Field, InputType } from "type-graphql";



@InputType()
export class UpdateUserInputType {

    @Field()
    usename: string

    @Field({ nullable: true })
    first_name?: string;

    @Field({ nullable: true })
    last_name?: string;

    @Field({ nullable: true })
    avatar?: string;

    @Field({ nullable: true })
    studied_at?: string;

    @Field({ nullable: true })
    work_at?: string;

    @Field({ nullable: true })
    github?: string;

    @Field({ nullable: true })
    facebook?: string;

    @Field({ nullable: true })
    tweeter?: string;


}