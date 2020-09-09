import { Arg, Mutation,  Query,  Resolver } from "type-graphql";

import { User } from "../entities/User";

const USERS: User[] = []

@Resolver(User)
export class userResolver {
    @Query(()=> [User])
    getUsers(){
        return USERS
    }

    @Mutation(()=> [User])
    createUser(
        @Arg('id') id: number,
        @Arg('username') username: string
    ): User[]{
        USERS.push({id,username})
        return USERS
    }
        
}