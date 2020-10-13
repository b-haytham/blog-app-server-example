import { GraphQLJSONObject } from "graphql-type-json";
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

    @Field(()=>GraphQLJSONObject)
    content: JSON

    @Field(()=> Category)
    category: Category

    @Field({nullable: true})
    tags?: string

    @Field()
    published: boolean
}

