import { DataSource } from 'typeorm'
import { User } from './src/modules/users/users.entity'
import { Subscription } from 'src/modules/subscription/subscription.entity'
import { Message } from 'src/modules/chat/message.entity'

import * as dotenv from 'dotenv'
dotenv.config()

export default new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT!, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Subscription, Message],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
})
