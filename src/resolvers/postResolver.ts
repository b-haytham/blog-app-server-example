import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { MyContext } from "src/Context";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entities/User";
import { ApolloError } from "apollo-server-express";

@Resolver(Post)
export class postResolver {
    @Mutation(() => Post)
    async createPost(
        @Arg("description") description: string,
        @Arg("title") title: string,
        @Arg("content") content: string,
        @Ctx() { req }: MyContext
    ) {
        const userId = req.session.userId;
        console.log(userId);

        const userRespository = getRepository(User);

        const u = await userRespository.findOne({ id: userId });

        if (!u) {
            return new ApolloError("blbal");
        }

        let post
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Post)
                .values({
                    title,
                    creatorId: u.id,
                    description,
                    content,
                })
                .returning("*")
                .execute();

            post = result.raw[0];
           
            await getConnection()
                .createQueryBuilder()
                .relation(User, "posts")
                .of(u)
                .add([post]);
        } catch (error) {
            console.log("ERRRRR", error);
        }

        console.log(post);
        return post;
    }

    @Mutation(()=>Post)
    async getPostById(
        @Arg('postId') postId : number
    ){
        const postRepo = getRepository(Post)
        const p = await postRepo.findOne(postId, {relations: ["creator"]})

        if(!p) {
            return new ApolloError('no Post')
        }

        console.log(p)
        return p
    }
}
