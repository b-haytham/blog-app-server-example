import { MyContext } from "src/Context";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../isAuth";
import {Comment} from '../entities/Comment'
import { Post } from "../entities/Post";
import { ApolloError } from "apollo-server-express";
import { getConnection } from "typeorm";
import { User } from "../entities/User";


@Resolver(Comment)
export class commentResolver{

    @Query(()=>Comment)
    async getCommentById(
        @Arg('commentId') commentId: number
    ){
        const comment = Comment.findOne(commentId)

        if(!comment){
            return new ApolloError('Comment Do Not Exists')
        }

        return comment
    }


    @Mutation(()=>Comment)
    @UseMiddleware(isAuth)
    async updateComment(
        @Arg('commentId') commentId: number,
        @Arg('content') _: string,
        @Ctx() {req}: MyContext
    ){
        const comment =await Comment.findOne(commentId)
        if(!comment || comment.creator.id !== req.session.userId){
            return new ApolloError('Error Updating Comment')
        }


        // update Comment to do
        return comment
    }

    @Mutation()
    @UseMiddleware(isAuth)
    async createComment(
        @Arg('postId') postId: number,
        @Arg('content') content: string,
        @Ctx() {req}: MyContext
    ){
        const loggedInUserId = req.session.userId

        const postToComment = await Post.findOne(postId)

        if(!postToComment){
            return new ApolloError('Post Do Not Exists')
        }

        let comment
        try {
            const result = await  getConnection()
                .createQueryBuilder()
                .insert()
                .into(Comment)
                .values({
                    content,
                })
                .returning('*')
                .execute()
            comment = result.raw[0]
            
            // to do make relation better
            await getConnection()
                .createQueryBuilder()
                .relation(Post, 'comments')
                .of(postToComment)
                .add(comment)

            await getConnection()
                .createQueryBuilder()
                .relation(User, 'comments')
                .of(loggedInUserId)
                .add(comment)
        } catch (error) {
            console.log(error)
        }
        return comment
    }



    @Mutation(()=>Boolean)
    @UseMiddleware(isAuth)
    async deleteComment(
        @Arg('commentId') commentId: number,
        @Ctx() {req}: MyContext
    ){

        const loggedInUserId = req.session.userId

        const comment = await Comment.findOne(commentId)

        if(!comment || comment.creator.id !== loggedInUserId){
            return new ApolloError('Error deleting Post')
        }



        // delete Comment to do
        return comment
    }
}