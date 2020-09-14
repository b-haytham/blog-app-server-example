import 'reflect-metadata';
import 'dotenv-safe/config'
import express from 'express'

import Redis from 'ioredis'
import session from 'express-session'
import cors from 'cors'
import connectRedis from "connect-redis";

import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from 'type-graphql';


import { userResolver } from './resolvers/userResolver';
import { COOKIE_NAME, __prod__ } from './constants';




const main = async () => {
    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis()
    
    app.use(cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }))

    app.use(session({
        name: COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            httpOnly: true,
            sameSite: 'lax',
            secure: __prod__,

        },
        saveUninitialized: false,
        secret: 'very long string',
        resave: false
    }))

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [userResolver],
            validate: false
        }),
        context: ({req, res})=>({
            req, 
            res
        })
    })

    apolloServer.applyMiddleware({app, cors: false})

    app.listen(8000, ()=> {
        console.log('>>>> Listening on http://localhost:8000')
    })

}


main().catch(err=> console.log(err))



