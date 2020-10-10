import { Field, InputType } from "type-graphql";
import { Category } from "./Category";


@InputType()
export class UpdatePostInputType {

    @Field()
    title: string;

    @Field()
    description: string;


    @Field({nullable: true})
    thumbnail?: string

    //content????
    @Field(() => String)
    content: string;

    @Field()
    published: boolean;

    @Field()
    tags?: string 

    @Field(()=> Category)
    category: Category

}