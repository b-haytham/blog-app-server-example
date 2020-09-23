import { Post } from "../entities/Post";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { MyContext } from "src/Context";
import { getConnection, getRepository } from "typeorm";
import { User } from "../entities/User";
import { ApolloError } from "apollo-server-express";
import { isAuth } from "../isAuth";

@Resolver(Post)
export class postResolver {
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
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
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('postId') postId: number,
        @Ctx() {req}:MyContext
    ){
        const loggedInUserId = req.session.userId
        const postToUpdate = await Post.findOne(postId)

        if(!postToUpdate){
            return new ApolloError('Post Do Not Exists')
        }

        if(loggedInUserId !== postToUpdate.creatorId){
            return new ApolloError('Not Authorized To Update')
        }


        // Update Post to do
        return postToUpdate
    }

    @Mutation(()=>Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('postId') postId: number,
        @Ctx() {req}:MyContext
    ){
        const loggedInUserId = req.session.userId
        const postToDelete = await Post.findOne(postId)

        if(!postToDelete){
            return new ApolloError('Post Do Not Exists')
        }

        if(loggedInUserId !== postToDelete.creatorId){
            return new ApolloError('Not Authorized To Update')
        }


        // delete Post to Do
        return postToDelete
    }

    @Query(()=>Post)
    async getPublicPostById(
        @Arg('postId') postId : number
    ){
        const postRepo = getRepository(Post)
        const p = await postRepo.findOne(postId, {where: {published: false}, relations: ["creator"]})
        
        if(!p) {
            return new ApolloError('Post Do not Exist')
        }

        console.log(p)
        return p
    }

}
