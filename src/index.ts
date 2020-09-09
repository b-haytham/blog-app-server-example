import 'reflect-metadata';

import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from 'type-graphql';

import { userResolver } from './resolvers/userResolver';

import express from 'express'


const main = async () => {
    const app = express()
    
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [userResolver]
        })
    })

    apolloServer.applyMiddleware({app})

    app.listen(8000, ()=> {
        console.log('>>>> Listening on http://localhost:8000')
    })

}


main().catch(err=> console.log(err))



