import 'reflect-metadata';
import 'dotenv-safe/config'
import express from 'express'
import path from 'path'

import Redis from 'ioredis'
import session from 'express-session'
import cors from 'cors'
import connectRedis from "connect-redis";

import {createConnection} from 'typeorm'

import {ApolloServer} from 'apollo-server-express'
import { buildSchema } from 'type-graphql';


import { userResolver } from './resolvers/userResolver';
import { COOKIE_NAME, __prod__ } from './constants';
import { postResolver } from './resolvers/postResolver';
import { commentResolver } from './resolvers/commentResolver';
import { likeResolver } from './resolvers/likeResolver';




const main = async () => {

    await createConnection()

    const app = express()

    const RedisStore = connectRedis(session)
    const redis = new Redis()
    

    app.use('/images', express.static(path.join(__dirname, '../images')))

    app.use(cors({
        origin: 'http://localhost:3000',
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
            resolvers: [userResolver, postResolver, commentResolver, likeResolver],
            validate: false
        }),
        context: ({req, res })=>({
            req, 
            res,
            redis
        })
    })

    apolloServer.applyMiddleware({app, cors: false, bodyParserConfig:{limit: '3mb'}})

    app.listen(8000, ()=> {
        console.log('>>>> Listening on http://localhost:8000')
    })

}


main().catch(err=> console.log(err))



