import { Field, InputType } from "type-graphql";
import { Category } from "./Category";

@InputType()
export class CreatePostInputType {

    @Field()
    title: string

    @Field()
    description: string

    @Field({nullable: true})
    thumbnail?: string

    @Field(()=>String)
    content: string

    @Field(()=> Category)
    category: Category

    @Field({nullable: true})
    tags?: string

    @Field()
    published: boolean
}

