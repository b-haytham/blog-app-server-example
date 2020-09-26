import { Like } from "../entities/Like";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../Context";
import { isAuth } from "../isAuth";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { ApolloError } from "apollo-server-express";
import { Comment } from "../entities/Comment";


@Resolver(Like)
export class likeResolver {

    @Mutation(()=> Boolean)
    @UseMiddleware(isAuth)
    async like(
        @Arg('parent') parent: 'POST' | 'COMMENT',
        @Arg('parentId') parentId: number, 
        @Ctx() {req}: MyContext
    ){

        switch(parent){
            case 'POST':
                try {
                    await likePost(parentId, req.session.userId)
                    return true
                } catch (error) {
                    return new ApolloError('Error Liking Post')
                }
            case 'COMMENT': 
                try {
                    await likeComment(parentId, req.session.userId)
                    return true
                } catch (error) {
                    return new ApolloError('Error Liking Post')
                } 
            default: 
                return new ApolloError('Something Wrong Liking')
        }
        

    }


    @Mutation(()=> Boolean)
    @UseMiddleware(isAuth)
    async dislike(
        @Arg('parent') parent: 'POST' | 'COMMENT',
        @Arg('parentId') parentId: number, 
        @Ctx() {req}: MyContext
    ){
        switch(parent){
            case 'POST':
                try {
                    await dislikePost(parentId, req.session.userId)
                    return true
                } catch (error) {
                    return new ApolloError('Error Disliking Post')
                }
            case 'COMMENT':
                try {
                    await dislikeComment(parentId, req.session.userId)
                    return true
                } catch (error) {
                    return new ApolloError('Error Disliking Comment')
                }    
            default:
                return new ApolloError('Error Disliking')
        }

    } 

}

const dislikePost = async(postId: number, creatorId: number) => {
    try {

        const result = await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Like)
            .where('postId = :postId', {postId})
            .andWhere('creatorId = : creatorId', {creatorId})
            .returning('*')
            .execute()
        return result.raw[0]
    } catch (error) {
        console.log(error)
        return error
    }
}


const dislikeComment = async(commentId: number, creatorId: number) => {
    try {

        const result = await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Like)
            .where('commentId = :commentId', {commentId})
            .andWhere('creatorId = : creatorId', {creatorId})
            .returning('*')
            .execute()
        return result.raw[0]
    } catch (error) {
        console.log(error)
        return error
    }
}


const likePost = async (postId: number, creatorId: number) => {

    try {
        const result =  await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Like)
            .values({
                creatorId,
                postId
            })
            .execute()
        
        const like = result.raw[0]
            

        await getConnection()
            .createQueryBuilder()
            .relation(Post, 'likes')
            .of(postId)
            .add(like)

        await getConnection()
            .createQueryBuilder()
            .relation(User, 'likes')
            .of(creatorId)
            .add(like)

        return like
    } catch (error) {
        console.log(error)
        return error
    }
    

}


const likeComment = async (commentId: number, creatorId: number) => {

    try {
        const result =  await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Like)
            .values({
                creatorId,
                commentId
            })
            .execute()
        
        const like = result.raw[0]
            

        await getConnection()
            .createQueryBuilder()
            .relation(Comment, 'likes')
            .of(commentId)
            .add(like)

        await getConnection()
            .createQueryBuilder()
            .relation(User, 'likes')
            .of(creatorId)
            .add(like)

        return like
    } catch (error) {
        console.log(error)
        return error
    }
    

}