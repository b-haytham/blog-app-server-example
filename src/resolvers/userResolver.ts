import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import argon2 from "argon2";

import { User } from "../entities/User";
import { getConnection, getRepository } from "typeorm";
import { ApolloError } from "apollo-server-express";
import { MyContext } from "src/Context";
import { v4 } from "uuid";
import { sendMail } from "../sendMail";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { isAuth } from "../isAuth";

@Resolver(User)
export class userResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: MyContext) {
        if (!req.session.userId) {
            return null;
        }
        const user = await User.findOne(req.session.userId)

        // const user = await getRepository(User)
        //     .createQueryBuilder("user")
        //     .leftJoinAndSelect("user.posts", "post")
        //     .where("user.id = :id", { id: req.session.userId })
        //     .getOne();

        console.log(user);
        return user;
    }

    @Query(()=>User)
    async getUser(
        @Arg('username') username: string
    ){
        const user = await User.findOne({where: {username}})

        if(!user) {
            return new ApolloError('User Do Not Exits')
        }

        return user
    }

    
    
    @Mutation(() => User)
    async createUser(
        @Arg("username") username: string,
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        const userRepository = getRepository(User);

        const u = await userRepository.findOne({ email });

        if (u) {
            return new ApolloError("user exist");
        }

        const hashedPassword = await argon2.hash(password);

        if (!hashedPassword) return null;

        let user;
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username,
                    email,
                    password: hashedPassword,
                })
                .returning("*")
                .execute();
            user = result.raw[0];
        } catch (error) {
            console.log("ERROR", error);
        }

        console.log(user);
        return user;
    }

    @Mutation(()=>User)
    @UseMiddleware(isAuth)
    async updateUser(
        @Arg('userId') userId: number,
        @Ctx() {req}:MyContext
    ){
        const loggedInUserId = req.session.userId
        const userToUpdate = await User.findOne(userId)

        if(!userToUpdate){
            return new ApolloError('User Do Not Exists')
        }

        if(loggedInUserId !== userToUpdate.id ){
            new ApolloError('Not Authorized to Update')
        }

        // update user to do
        return userToUpdate  
    }

    @Mutation(() => User)
    async signInUser(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ) {
        const userRepository = getRepository(User);

        const u = await userRepository.findOne({ email });

        if (!u) {
            return new ApolloError("wrong credentials1", "413");
        }

        const validPassword = await argon2.verify(u.password, password);

        if (!validPassword) {
            return new ApolloError("wrong credentials2", "413");
        }

        req.session.userId = u.id;
        return u;
    }

    @Mutation(() => Boolean)
    async forgetPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: MyContext
    ) {
        const userRepository = getRepository(User);

        const u = await userRepository.findOne({ email });

        if (!u) {
            return new ApolloError("user do not exist", "413");
        }

        const token = v4();

        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            u.id,
            "ex",
            1000 * 60 * 60 * 24 * 3
        );

        await sendMail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );

        return true;
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) => {
            return req.session.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
}
