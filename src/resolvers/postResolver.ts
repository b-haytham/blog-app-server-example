import { Post } from "../entities/Post";
import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    UseMiddleware,
    
} from "type-graphql";

import { MyContext } from "src/Context";
import { getConnection, getRepository, Like } from "typeorm";
import { User } from "../entities/User";
import { ApolloError } from "apollo-server-express";
import { isAuth } from "../isAuth";
import { UpdatePostInputType } from "../types/UpdatePostInputType";
import { CreatePostInputType } from "../types/CreatePostInputType";


@Resolver(Post)
export class postResolver {
    @Query(() => [Post])
    @UseMiddleware(isAuth)
    async getLoggedInUserPosts(
        @Arg('query') query: string,
        @Ctx() { req }: MyContext
    ) {
        const loggedInUserId = req.session.userId;

        if(query.length === 0) {

            const posts = await Post.find({
                where: { creatorId: loggedInUserId },
                relations: ["creator", "comments", "likes"],
            });
    
            return posts;
        }else {
            const posts = await Post.find({
                where: [
                    { creatorId: loggedInUserId, title: Like(`%${query}%`)},
                    { creatorId: loggedInUserId, description: Like(`%${query}%`)},
                    { creatorId: loggedInUserId, tags: Like(`%${query}%`)},
                ],
                relations: ["creator", "comments", "likes"]
            })

            return posts
        }

    }

    @Query(() => Post)
    @UseMiddleware(isAuth)
    async getPostById(
        @Arg("postId") postId: number,
        @Ctx() { req }: MyContext
    ) {
        const loggedInUserId = req.session.userId;

        const post = await Post.findOne(postId);
        if (!post) {
            return new ApolloError("Post do not exist");
        }

        if (loggedInUserId !== post.creatorId) {
            return new ApolloError("Not Authorized To get Post");
        }

        return post;
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('input') input: CreatePostInputType , 
        @Ctx() { req }: MyContext
    ) {
        const userId = req.session.userId;
        console.log(userId);

        const userRespository = getRepository(User);

        const u = await userRespository.findOne({ id: userId });

        if (!u) {
            return new ApolloError("blbal");
        }

        const values = {
            title : input.title,
            description: input.description,
            content: input.content,
            category: input.category,
            tags: input.tags,
            published: input.published,
            creatorId: u.id
        }
        if(input.thumbnail) {
            //@ts-ignore
            values.thumbnail = input.thumbnail
        }




        let post;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Post)
                .values(values)
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
            return new ApolloError(error)
        }

        return post;
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("postId") postId: number,
        @Arg("input") input: UpdatePostInputType,
        @Ctx() { req }: MyContext
    ) {
        const loggedInUserId = req.session.userId;
        const postToUpdate = await Post.findOne(postId);

        if (!postToUpdate) {
            return new ApolloError("Post Do Not Exists");
        }

        if (loggedInUserId !== postToUpdate.creatorId) {
            return new ApolloError("Not Authorized To Update");
        }

        let newPost;

        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Post)
                .set(input)
                .where("id = :id", { id: postToUpdate.id })
                .returning("*")
                .execute();
            newPost = result.raw[0];
        } catch (error) {
            console.log(error);
        }

        // Check to do
        return newPost;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(@Arg("postId") postId: number, @Ctx() { req }: MyContext) {
        const loggedInUserId = req.session.userId;
        const postToDelete = await Post.findOne(postId);

        if (!postToDelete) {
            return new ApolloError("Post Do Not Exists");
        }

        if (loggedInUserId !== postToDelete.creatorId) {
            return new ApolloError("Not Authorized To Update");
        }

        
        // check
        await Post.delete({ id: postId, creatorId: loggedInUserId });

        return true;
    }

    @Query(() => [Post])
    async getPublicPosts(
        @Arg('query') query: string
    ) {

        
        if(query.length === 0){
            const posts = await Post.find({
                where: { published: true },
                relations: ["creator", "comments", "likes"],
            });
            
            return posts;
        }else{
            const posts = await Post.find({
                where: [
                    {published: true , title: Like(`%${query}%`)},
                    {published: true , description: Like(`%${query}%`)},
                    {published: true , tags: Like(`%${query}%`)},
                    {published: true , description: Like(`%${query}%`)},
                    
                ],
                relations: ["creator", "comments", "likes"],
            })
            return posts
        }
    }

    @Query(() => Post)
    async getPublicPostById(@Arg("postId") postId: number) {
        const postRepo = getRepository(Post);
        const p = await postRepo.findOne(postId, {
            where: { published: true },
            relations: ["creator", "comments", "likes"],
        });

        if (!p) {
            return new ApolloError("Post Do not Exist");
        }

        
        return p;
    }


    
}
